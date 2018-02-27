import { OrderSide, OrderType, TimeForce } from '../interfaces/order.model';
import { CurrencySymbol, CurrenciesParams } from '../interfaces/currency.model';
import { getSymbol } from '../services/helpers';
import axios, { AxiosResponse } from 'axios';
import { restMethodsKeys } from '../keys/methods';
import { RestApiMethod } from '../interfaces/api.model';
import { AUTH_REST_API_PATH } from '../keys/main';
import { orderTypeCollection } from '../keys/order';

interface ApiOrderParams {
  clientOrderId?: string;
  symbol: CurrencySymbol;
  side: OrderSide;
  type?: OrderType;
  timeInForce?: TimeForce;
  quantity: number;
  price?: number;
  stopPrice?: number;
  expireTime?: Date;
  strictValidate: boolean;
}

interface ApiOrderResponse extends ApiOrderParams {
  id: number;
}

export class OrdersAPI {

  private readonly eventName = restMethodsKeys.CREATE_ORDER;
  private readonly method: RestApiMethod = 'GET';

  constructor(
    private readonly currencies: CurrenciesParams
  ) {}

  private get symbol(): CurrencySymbol {
    return getSymbol(this.currencies);
  }

  private get requestUrl(): string {
    return (
      AUTH_REST_API_PATH + this.eventName + '/' + this.symbol
    );
  }

  private getParams(side: OrderSide): ApiOrderParams {
    return {
      symbol: this.symbol,
      side,
      type: orderTypeCollection.MARKET,
      quantity: NaN,
      strictValidate: true
    }
  }

  public createOrder(
    side: OrderSide
  ) {
    return new Promise<number>(resolve => {
      axios.get<ApiOrderResponse>(
        this.requestUrl,
        { params: this.getParams(side) }
      )
      .then((response) => {
        resolve(response.data.id);
      })
    });
  }
}