import { CurrencySymbol, Currency, CurrencyTicker, CurrencyId } from '../interfaces/currency.model';
import { API_PATH } from './keys';
import { w3cwebsocket as WebSocket } from 'websocket';


export class CurrencyRate {
  private id: CurrencyId;
  private soket;
  private currency: Currency;
  private currencyTicker: CurrencyTicker;
  
  constructor(id: CurrencyId) {
    this.id = id;
    console.log(WebSocket);
    this.openCurrencySoket();
  }

  // public get rate(): CurrencyTicker  {
  //   this.soket.
  // }

  private openCurrencySoket() {
    
  }

  private openTikerSoket() {
    this.soket.onopen = (event) => {
      const params = {
        method: 'subscribeTicker',
        params: {
          symbol: 'ETHBTC'
        },
        id: 123
      }
      this.soket.send(JSON.stringify(params))
    }
    this.soket.onmessage = (event) => {
      console.log(event.data);
    }
  }

}
