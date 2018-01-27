import { candlesAPI } from './api/index';
import { CANDLES_QUANTITY, MS_INTERVAL } from './keys/main';
import { Candle } from './interfaces/currency.model';
import { CandlesAPI } from './api/candels';
import { setInterval } from 'timers';

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
    console.log(this.lastCandle);
  }

  private get lastCandle(): Candle {
    return this.candlesCollection[
      this.candlesCollection.length - 1
    ];
  }

  private async init(): Promise<void> {
    this.candlesCollection = await candlesAPI.getCandels(
      CANDLES_QUANTITY
    );
    
    console.log(this.lastCandle);

    this.timer = setInterval(
      () => this.implementStep(),
      MS_INTERVAL
    );
  }
}