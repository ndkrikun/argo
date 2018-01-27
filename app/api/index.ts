import { TickersAPI } from './tickers';
import { CandlesAPI } from './candels';
import { CurrenciesParams } from '../interfaces/currency.model';

const currencies: CurrenciesParams = {
  base: 'ETH',
  quote: 'BTC'
};

export const tickersAPI = new TickersAPI(currencies);

export const candlesAPI = new CandlesAPI(currencies);
