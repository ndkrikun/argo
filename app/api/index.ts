import { TickerService } from './ticker';
import { CandlesService } from './candels';
import { CurrenciesParams } from '../interfaces/currency.model';

const currencies: CurrenciesParams = {
  from: 'ETH',
  to: 'BTC'
};

const ticker = new TickerService(currencies);


// const candels = new CandlesService(currencies)

// candels.getCandels();