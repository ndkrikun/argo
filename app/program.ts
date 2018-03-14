import { candlesAPI, ordersAPI, balanceAPI, symbolsAPI } from './api-hitbtc/index';
import { telegramBot } from './api-telegram/index';
import { MS_INTERVAL, TG_CHAT_ID, CANDLES_INITIAL_QUANTITY, CURRENCIES_PAIR, TG_TEST_CHAT_ID } from './keys/main';
import { Candle, CurrencyId, Balance, CurrencySymbolData } from './interfaces/currency.model';
import { setInterval, clearInterval, setTimeout } from 'timers';
import { macdSignal } from './algorithms/index';
import { messageService } from './services/index';
import { orderSideCollection } from './keys/order';
import { OrderSide } from './interfaces/order.model';
import { TickersSoketAPI } from './api-hitbtc/tickers.soket';

export class Program {
  private tickersSoket = new TickersSoketAPI;
  private symbolData: CurrencySymbolData;
  private candlesCollection: Candle[];
  private waitingTimer: NodeJS.Timer;
  private programTimer: NodeJS.Timer;

  constructor() {
    this.startServer();
  }

  /**
   * Fetches new candle
   */
  private async updateCandles(): Promise<void> {
    const newCandle: Candle[] = await candlesAPI.getCandels();
    this.candlesCollection.push(newCandle[0]);
  }

  /**
   * Interval step
   */
  private async implementStep() {
    await this.updateCandles();
    this.analyze();
  }

  /**
   * Returns last candle
   */
  private get lastCandle(): Candle {
    return this.candlesCollection[
      this.candlesCollection.length - 1
    ];
  }

  /**
   * Tells if trend was changed
   * @param solution analyze solution
   */
  private isTrendChanged(
    solution: number[]
  ): boolean {
    return (solution[0] * solution[1]) < 0
  }

  /**
   * Returns order side by solution
   * @param solution analyze solution
   */
  private getOrderSide(
    solution: number[]
  ): OrderSide {
    return solution[0] < solution[1]
      ? orderSideCollection.BUY
      : orderSideCollection.SELL;
  }

  /**
   * Returns currency that is necessary before trade transaction
   * @param solution analyze solution
   */
  private getTradeCurrency(
    solution: number[]
  ): CurrencyId {
    return solution[0] < solution[1]
      ? CURRENCIES_PAIR.quote
      : CURRENCIES_PAIR.base;
  }

  /**
   * Tells if trend is positive
   * @param solution analyze solution
   */
  private isPositiveTrend(
    solution: number[]
  ): boolean {
    return solution[0] < solution[1];
  }

  /**
   * Send candle info message to the chat
   * @param solution analyze solution
   * @param chatId id of the tg chat
   */
  private sendCandleInfo(solution: number[], chatId: string): void {
    const message = messageService.candleMessage(
      this.lastCandle,
      solution
    );
    telegramBot.sendMessage(message, chatId);
  }

  /**
   * Send trand info message to the chat
   * @param solution analyze solution
   * @param chatId id of the tg chat
   */
  private sendTrendInfo(solution: number[], chatId: string): void {
    const message = messageService.trendMessage(
      this.lastCandle,
      solution,
      this.isPositiveTrend(solution)
    );
    telegramBot.sendMessage(message, chatId);
  }

  /**
   * Increment of base currency
   */
  private get currencyIncrement(): number {
    return !!this.symbolData
      ? Number(this.symbolData.quantityIncrement)
      : 0;
  }

  /**
   * Fee of the symbol
   */
  private get currencyFee(): number {
    return !!this.symbolData
      ? Number(this.symbolData.takeLiquidityRate)
      : 0;
  }

  /**
   * Returns quantity for order
   * @param solution analyze silution
   * @param balance trading balance
   * @param currency balance currency
   */
  private getQuantity(
    solution: number[],
    balance: Balance[],
    currency: CurrencyId
  ): { quantity: number, price: number } {
    /**
     * @todo refactor
     */
    const increment = this.currencyIncrement;

    const currencyBalance = balance.reduce((acc, el) =>
      el.currency === currency
        ? Number(el.available)
        : acc,
      0
    );

    const bestAsk = Number(this.tickersSoket.tickerData.ask);

    if (this.isPositiveTrend(solution)) {
      const balanceWithFee = currencyBalance * (1 - this.currencyFee);
      const quantity = balanceWithFee / bestAsk;
      return {
        quantity: (Math.ceil((Math.ceil(quantity) / increment)) * increment) - increment,
        price: bestAsk
      };
    }

    return {
      quantity: currencyBalance,
      price: bestAsk
    };
  }

  /**
   * Send current balance amount
   */
  private sendBalanceInfo(balance: Balance[]): void {
    const currenciesBalance = balance.filter(el =>
      el.currency === CURRENCIES_PAIR.base ||
      el.currency === CURRENCIES_PAIR.quote
    );
    telegramBot.sendMessage(
      messageService.balanceMessage(currenciesBalance),
      TG_CHAT_ID
    );
  }

  /**
   * Send order info message
   */
  private sendOrderMessage(
    quantity: number,
    currency: CurrencyId,
    solution: number[]
  ): void {
    telegramBot.sendMessage(
      messageService.orderMessage(quantity, currency, this.isPositiveTrend(solution)),
      TG_CHAT_ID
    );
  }

  /**
   * Analyze logic
   */
  private async analyze(): Promise<void> {
    const solution = macdSignal.agregate(
      this.candlesCollection
    );

    if (!this.isTrendChanged(solution)) { return; }

    this.sendTrendInfo(solution, TG_CHAT_ID);

    const balance = await balanceAPI.getBalance();

    const currency = this.getTradeCurrency(solution);

    const { quantity, price } = this.getQuantity(solution, balance, currency);

    if (quantity <= this.currencyIncrement) { return; }

    this.sendOrderMessage(quantity, currency, solution);

    await ordersAPI.createOrder(this.getOrderSide(solution), quantity, price);

    const balanceAfterTransaction = await balanceAPI.getBalance();

    this.sendBalanceInfo(balanceAfterTransaction);
  }

  /**
   * Tells if bot is ready to start
   */
  private get readyToStart(): boolean {
    const second = new Date().getSeconds();
    return (
      second === 0 ||
      second === 1
    );
  }

  /**
   * Step before bot activation
   */
  private waitingStep(): void {
    if (this.readyToStart) {
      clearInterval(this.waitingTimer);
      this.startBot();
    }
  }

  /**
   * Init bot
   */
  private async startBot(): Promise<void> {
    telegramBot.sendMessage(messageService.startProgram(this.symbolData), TG_CHAT_ID);

    this.candlesCollection = await candlesAPI.getCandels(
      CANDLES_INITIAL_QUANTITY
    );

    this.analyze();

    this.programTimer = setInterval(
      () => this.implementStep(),
      MS_INTERVAL
    );
  }

  /**
   * Init server
   */
  private async startServer(): Promise<void> {
    this.symbolData = await symbolsAPI.getSymbol();

    telegramBot.sendMessage(messageService.startServer, TG_CHAT_ID);

    if (this.readyToStart) {
      this.startBot();
      return;
    }

    setTimeout(
      () => telegramBot.sendMessage(messageService.waiting, TG_CHAT_ID),
      100
    );

    this.waitingTimer = setInterval(
      () => this.waitingStep(),
      1000
    );
  }
}