import { Candle } from '../interfaces/currency.model';

export class MacdSignal {
  private readonly muliplier: number = 1000000;

  private firstForEma(
    candles: number[],
    length: number
  ): number {    
    const firstCandles: number[] = candles
      .filter((candle, index) => index < length);

    const closeSum = firstCandles.reduce((acc, el) => {
      acc += el
      return acc;
    }, 0);

    return closeSum / firstCandles.length;
  }

  private elementForEma(
    currentCandle: number,
    prevElement: number,
    length: number
  ): number {
    return (currentCandle * 2 / (length + 1)) + (prevElement * (1 - 2 / (length + 1)));
  }

  private ema(
    candles: number[],
    signalLength: number
  ): number[] {
    let EMA: number[] = [];

    const firstForEma = this.firstForEma(
      candles,
      signalLength
    );

    EMA.push(firstForEma);

    candles.forEach((candle, index) => {
      if (index < signalLength) {
        return;
      }

      const prevElement: number = EMA[index - signalLength];

      EMA.push(
        this.elementForEma(
          candle,
          prevElement,
          signalLength
        )
      )
    });

    return EMA;
  }

  private differential(
    short: number[],
    long: number[]
  ) {
    const diff = long.length - short.length;
    const shortArr = short;
    const longArr = long.filter((el, index) => index >= diff);

    let res = new Array<number>();

    longArr.forEach((el, index) => {
      res.push(
        shortArr[index] - longArr[index]
      )
    })

    return res;
  }

  private prepareSolution(
    solution: number[]
  ): number[] {
    return [
      this.muliplier * solution[solution.length - 2],
      this.muliplier * solution[solution.length - 1]
    ]
  }

  public agregate(
    candlesCollection: Candle[]
  ): number[] {
    const candles: number[] = Object.keys(candlesCollection)
      .map((key) => Number(candlesCollection[key].close));
    
    const macd = this.differential(
      this.ema(candles, 26),
      this.ema(candles, 12)
    );

    const signal = this.ema(macd, 9)

    const solution = this.differential(
      signal,
      macd
    );

    return this.prepareSolution(
      solution
    )
  }
}