import { candlesAPI, telegramBot } from './api/index';
import { CANDLES_QUANTITY, MS_INTERVAL, TG_TEST_CHAT_ID, TG_CHAT_ID } from './keys/main';
import { Candle } from './interfaces/currency.model';
import { setInterval, clearInterval } from 'timers';
import { macdSignal } from './algorithms/index';
import { messageService } from './helpers/index';

export class Program {
  private candlesCollection: Candle[];
  private waitingTimer: NodeJS.Timer;
  private programTimer: NodeJS.Timer;

  constructor() {
    this.init();
  }

  private async updateCandles(): Promise<void> {
    const newCandle: Candle[] = await candlesAPI.getCandels()
    this.candlesCollection.splice(0, 1)
    this.candlesCollection.push(newCandle[0]);
  }

  private async implementStep() {
    await this.updateCandles()
    this.analyze();
  }

  private get lastCandle(): Candle {
    return this.candlesCollection[
      this.candlesCollection.length - 1
    ];
  }

  private isTrendChanged(
    solution: number[]
  ): boolean {
    return (solution[0] * solution[1]) < 0
  }

  private isPositiveTrend(
    solution: number[]
  ): boolean {
    return solution[0] < solution[1];
  }

  private analyze(): void {
    const solution = macdSignal.agregate(
      this.candlesCollection
    );

    const message = messageService.candleMessage(
      this.lastCandle,
      solution
    )
    telegramBot.sendMessage(message, TG_TEST_CHAT_ID)

    if (this.isTrendChanged(solution)) {
      const message = messageService.trendMessage(
        this.lastCandle,
        solution,
        this.isPositiveTrend(solution)
      )
      telegramBot.sendMessage(message, TG_CHAT_ID)
    }
  }

  private get readyToStart() {
    const second = new Date().getSeconds();
    return (second === 0
      ||    second === 1);
  }

  private waitingStep() {
    if (this.readyToStart) {
      clearInterval(this.waitingTimer);
      this.start()
    }
  }

  private init() {
    telegramBot.sendMessage(messageService.startServer, TG_TEST_CHAT_ID)

    if (this.readyToStart) {
      this.start();
    } else {
      telegramBot.sendMessage(messageService.waiting, TG_TEST_CHAT_ID)
      this.waitingTimer = setInterval(
        () => this.waitingStep(),
        1000
      )
    }
  }
  
  private async start(): Promise<void> {
    telegramBot.sendMessage(messageService.startProgram, TG_TEST_CHAT_ID)

    this.candlesCollection = await candlesAPI.getCandels(
      CANDLES_QUANTITY
    );
  
    this.analyze();
  
    this.programTimer = setInterval(
      () => this.implementStep(),
      MS_INTERVAL
    );
  }
}