import { CurrenciesParams, CurrencySymbol, Ticker } from '../interfaces/currency.model';
import { WS_API_PATH, SOKET_DEFAULT_ID, CURRENCIES_PAIR } from '../keys/main';
import { w3cwebsocket as WebSocket } from 'websocket';
import { Socket } from 'dgram';
import { ApiResponse, ApiError } from '../interfaces/api.model';
import { wsMethodsKeys } from '../keys/methods';


interface ApiTickerParams {
  method: string;
  params: object;
  id: number;
}

export class TickersAPI {
  private readonly soket = new WebSocket(WS_API_PATH);
  private readonly eventName = wsMethodsKeys.SUBSCRIBE_TICKER;

  public tickerData: Ticker = null;

  private get symbol(): CurrencySymbol {
    return CURRENCIES_PAIR.symbol;
  }

  private get apiParams(): ApiTickerParams {
    return {
      method: this.eventName,
      params: {
        symbol: this.symbol
      },
      id: SOKET_DEFAULT_ID
    }
  }

  public init(): void {
    this.soket.onopen = event => {
      this.soket.send(
        JSON.stringify(this.apiParams)
      );
    }
    this.soket.onmessage = event => {
      const response: ApiResponse<Ticker> = JSON.parse(event.data);
      if ('params' in response) {
        this.tickerData = response.params;
      }
    }
  }
}
