import { CURRENCIES_PAIR } from '../keys/main';
import { TickersAPI } from './tickers';
import { CandlesAPI } from './candels';
import { OrdersAPI } from './orders';

export const tickersAPI = new TickersAPI(CURRENCIES_PAIR);

export const candlesAPI = new CandlesAPI(CURRENCIES_PAIR);

export const ordersAPI = new OrdersAPI(CURRENCIES_PAIR);
