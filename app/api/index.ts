import { TickersAPI } from './tickers';
import { CandlesAPI } from './candels';
import { CurrenciesParams } from '../interfaces/currency.model';
import { TelegramBot } from './telegram-bot';

const currencies: CurrenciesParams = {
  base: 'ETH',
  quote: 'BTC'
};

export const tickersAPI = new TickersAPI(currencies);

export const candlesAPI = new CandlesAPI(currencies);

export const telegramBot = new TelegramBot;
