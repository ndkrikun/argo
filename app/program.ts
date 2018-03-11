import { candlesAPI, ordersAPI, balanceAPI } from './api-hitbtc/index';
import { telegramBot } from './api-telegram/index';
import { MS_INTERVAL, TG_TEST_CHAT_ID, TG_CHAT_ID, CANDLES_INITIAL_QUANTITY, CURRENCIES_PAIR } from './keys/main';
import { Candle, CurrencyId, Balance } from './interfaces/currency.model';
import { setInterval, clearInterval, setTimeout } from 'timers';
import { macdSignal } from './algorithms/index';
import { messageService } from './services/index';
import { orderSideCollection } from './keys/order';
import { OrderSide } from './interfaces/order.model';

export class Program {
  private candlesCollection: Candle[];
  private waitingTimer: NodeJS.Timer;
  private programTimer: NodeJS.Timer;

  constructor() {
    this.init();
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

  private getRequiredCurrency(
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
   * Returns quantity for order
   * @param solution analyze silution
   * @param balance trading balance
   * @param currency balance currency
   */
  private getQuantity(
    solution: number[],
    balance: Balance[],
    currency: CurrencyId
  ): number {
    /**
     * @TODO: Remove hardcode
     * Take increment from GET /api/2/public/symbol/{symbol} API
     */
    const increment = 100;

    const currencyBalance = balance.reduce((acc, el) =>
      el.currency === currency
        ? Number(el.available)
        : acc,
      0
    );

    if (this.isPositiveTrend(solution)) {
      const quantity = ((currencyBalance / Number(this.lastCandle.close)) - (increment * 2));
      return Math.ceil((Math.ceil(quantity) / increment)) * increment;
    }

    return currencyBalance;
  }

  /**
   * Analyze logic
   */
  private async analyze(): Promise<void> {
    const solution = macdSignal.agregate(
      this.candlesCollection
    );

    this.sendCandleInfo(solution, TG_TEST_CHAT_ID);

    if (!this.isTrendChanged(solution)) { return; }

    this.sendTrendInfo(solution, TG_CHAT_ID);

    const balance = await balanceAPI.getBalance();

    const currency = this.getRequiredCurrency(solution);

    const quantity = this.getQuantity(solution, balance, currency);

    console.log(`Quantity is ${quantity}`);

    if (quantity <= 0) { return; }

    telegramBot.sendMessage(
      messageService.orderMessage(quantity, currency, this.isPositiveTrend(solution)),
      TG_CHAT_ID
    );

    ordersAPI.createOrder(
      this.getOrderSide(solution),
      quantity
    );
  }

  /**
   * Tells if app is ready to start
   */
  private get readyToStart(): boolean {
    const second = new Date().getSeconds();
    return (second === 0
      ||    second === 1);
  }

  /**
   * Step before app was start
   */
  private waitingStep(): void {
    if (this.readyToStart) {
      clearInterval(this.waitingTimer);
      this.start();
    }
  }

  /**
   * Init application
   */
  private async start(): Promise<void> {
    telegramBot.sendMessage(messageService.startProgram, TG_CHAT_ID);

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
  private init(): void {
    telegramBot.sendMessage(messageService.startServer, TG_CHAT_ID);

    if (this.readyToStart) {
      this.start();
      return;
    }

    setTimeout(
      () => telegramBot.sendMessage(messageService.waiting, TG_CHAT_ID),
      10
    );

    this.waitingTimer = setInterval(
      () => this.waitingStep(),
      1000
    );
  }
}