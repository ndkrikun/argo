import { CURRENCIES_PAIR } from '../keys/main';
import { TickersAPI } from './tickers';
import { CandlesAPI } from './candels';
import { OrdersAPI } from './orders';
import { BalanceAPI } from './balance';
import { SymbolsAPI } from './symbols';

export const tickersAPI = new TickersAPI;

export const candlesAPI = new CandlesAPI;

export const ordersAPI = new OrdersAPI;

export const balanceAPI = new BalanceAPI;

export const symbolsAPI = new SymbolsAPI;
