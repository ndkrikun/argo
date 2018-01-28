import { candlesAPI, telegramBot } from './api/index';
import { CANDLES_QUANTITY, MS_INTERVAL, CURRENCIES_PAIR } from './keys/main';
import { Candle } from './interfaces/currency.model';
import { CandlesAPI } from './api/candels';
import { setInterval } from 'timers';
import { macdSignal } from './algorithms/index';

export class Program {
  private candlesCollection: Candle[];
  private timer;

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

  private defineTrend(
    solution: number[]
  ): string {
    if (solution[0] < solution[1]) {
      return 'Buy!'
    }
    return 'Sell!';
  }

  private analyze(): void {
    const solution = macdSignal.agregate(
      this.candlesCollection
    );

    if (this.isTrendChanged(solution)) {
      const trend = this.defineTrend(solution);
      telegramBot.sendMessage(
        `${trend} The trend was changed! From ${solution[0]} to ${solution[1]}. Currency pair: ${CURRENCIES_PAIR.base}${CURRENCIES_PAIR.quote}`
      )
    }
  }

  private async init(): Promise<void> {
    this.candlesCollection = await candlesAPI.getCandels(
      CANDLES_QUANTITY
    );

    this.analyze();

    this.timer = setInterval(
      () => this.implementStep(),
      MS_INTERVAL
    );
  }
}