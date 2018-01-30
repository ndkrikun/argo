import { Candle } from '../interfaces/currency.model';
import { CURRENCIES_PAIR, CANDLES_INITIAL_QUANTITY } from '../keys/main';

export class MessageService {
  private trendAction(
    isPositiveTrend
  ) {
    return isPositiveTrend ? '\xE2\x9C\x85 BUY!' : '\xE2\x9D\x8C SELL!'
  }

  public trendMessage(
    candle: Candle,
    solution: number[],
    isPositiveTrend: boolean
  ): string {
    const trend = this.trendAction(isPositiveTrend);
    const lines = [
      `<b>${trend}</b> The trend was changed! From <b>${solution[0]}</b> to <b>${solution[1]}</b>`,
      `Currency pair: <b>${CURRENCIES_PAIR.base}${CURRENCIES_PAIR.quote}.</b>`,
      `Open price: <b>${candle.open}</b>.`,
      `Close price: <b>${candle.close}</b>.`,
      `Time stamp: <b>${candle.timestamp}</b>.`
    ]
    return lines.join('\n')
  }

  public candleMessage(
    candle: Candle,
    solution: number[]
  ): string {
    const lines = [
      `\xF0\x9F\x93\xA2 <b>NEW CANDLE</b> Changed from <b>${solution[0]}</b> to <b>${solution[1]}</b>`,
      `Currency pair: <b>${CURRENCIES_PAIR.base}${CURRENCIES_PAIR.quote}.</b>`,
      `Open price: <b>${candle.open}</b>.`,
      `Close price: <b>${candle.close}</b>.`,
      `Time stamp: <b>${candle.timestamp}</b>.`
    ]
    return lines.join('\n')
  }

  public get startServer(): string {
    return '\xF0\x9F\x8C\x90 <b>Starting the server...</b>';
  }

  public get waiting(): string {
    return '\xE2\x8F\xB3 <b>Waiting for the last candle...</b>';
  }

  public get startProgram(): string {
    return `\xF0\x9F\x93\xA2 The last <b>${CANDLES_INITIAL_QUANTITY}</b> candles was fetched.\n\n \xF0\x9F\x91\xBE Starting the bot...`
  }
}
