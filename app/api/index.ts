import { TickersAPI } from './tickers';
import { CandlesAPI } from './candels';
import { TelegramBot } from './telegram-bot';
import { CURRENCIES_PAIR } from '../keys/main';

export const tickersAPI = new TickersAPI(CURRENCIES_PAIR);

export const candlesAPI = new CandlesAPI(CURRENCIES_PAIR);

export const telegramBot = new TelegramBot;
