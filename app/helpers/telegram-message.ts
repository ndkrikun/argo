import { Candle } from '../interfaces/currency.model';
import { CURRENCIES_PAIR, CANDLES_INITIAL_QUANTITY } from '../keys/main';
import { emojiCollection } from '../keys/emoji';
import { orderTypeCollection, OrderType } from '../keys/order';

export class MessageService {
  private trendAction(
    isPositiveTrend
  ) {
    const orderType: OrderType = isPositiveTrend ? orderTypeCollection.BUY : orderTypeCollection.SELL;
    const orderTypeEmoji = isPositiveTrend ? emojiCollection.BUY : emojiCollection.SELL;
    return `${orderTypeEmoji} ${orderType.toUpperCase()}!`;
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
      `${emojiCollection.NOTIFY} <b>NEW CANDLE</b> Changed from <b>${solution[0]}</b> to <b>${solution[1]}</b>`,
      `Currency pair: <b>${CURRENCIES_PAIR.base}${CURRENCIES_PAIR.quote}.</b>`,
      `Open price: <b>${candle.open}</b>.`,
      `Close price: <b>${candle.close}</b>.`,
      `Time stamp: <b>${candle.timestamp}</b>.`
    ]
    return lines.join('\n')
  }

  public get startServer(): string {
    return `${emojiCollection.SERVER} <b>Starting the server...</b>`;
  }

  public get waiting(): string {
    return `${emojiCollection.WAITING} <b>Waiting for the last candle...</b>`;
  }

  public get startProgram(): string {
    return `${emojiCollection.NOTIFY} The last <b>${CANDLES_INITIAL_QUANTITY}</b> candles was fetched.\n\n ${emojiCollection.BOT} Starting the bot...`
  }
}
