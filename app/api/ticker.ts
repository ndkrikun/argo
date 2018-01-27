import { Currency, CurrencyId, CurrenciesParams, TickerSymbol, Ticker } from '../interfaces/currency.model';
import { WS_API_PATH } from '../keys/main';
import { w3cwebsocket as WebSocket } from 'websocket';
import { Socket } from 'dgram';
import { ApiResponse, ApiError } from '../interfaces/api.model';
import { wsMethodsKeys } from '../keys/methods';


interface ApiTickerParams {
  method: string;
  params: object;
  id: number;
}

export class TickerService {
  private soket = new WebSocket(WS_API_PATH);
  private responseData: ApiResponse<Ticker>;

  private readonly eventName = wsMethodsKeys.SUBSCRIBE_TICKER;
  
  constructor(
    private params: CurrenciesParams
  ) {
    this.openTickerSoket();
  }

  private get symbol(): TickerSymbol {
    return (
      this.params.from + this.params.to
    ) as TickerSymbol;
  }

  private get apiParams(): ApiTickerParams {
    return {
      method: this.eventName,
      params: {
        symbol: this.symbol
      },
      id: 123
    }
  }

  private openTickerSoket(): void {
    this.soket.onopen = event => {
      this.soket.send(
        JSON.stringify(this.apiParams)
      );
    }
    
    this.soket.onmessage = event => {
      this.responseData = JSON.parse(event.data);
      // console.log(Object.keys(this.responseData))
    }
  }

  public get tickerData(): Ticker | null {
    return !!this.responseData && 'params' in this.responseData
      ? this.responseData.params
      : null;
  }
}
