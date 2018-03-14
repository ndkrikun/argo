import { OrderSide, OrderType, TimeForce } from '../interfaces/order.model';
import { CurrencySymbol } from '../interfaces/currency.model';
import axios, { AxiosResponse } from 'axios';
import { restMethodsKeys } from '../keys/methods';
import { RestApiMethod, ApiError } from '../interfaces/api.model';
import { AUTH_REST_API_PATH, TG_CHAT_ID, TG_TEST_CHAT_ID, CURRENCIES_PAIR } from '../keys/main';
import { orderTypeCollection } from '../keys/order';
import { telegramBot } from '../api-telegram/index';
import { messageService } from '../services/index';

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
  strictValidate?: boolean;
}

interface ApiOrderResponse extends ApiOrderParams {
  id: number;
}

export class OrdersAPI {

  private readonly eventName = restMethodsKeys.CREATE_ORDER;
  private readonly method: RestApiMethod = 'POST';

  private get symbol(): CurrencySymbol {
    return CURRENCIES_PAIR.symbol;
  }

  private get requestUrl(): string {
    return (
      AUTH_REST_API_PATH + this.eventName
    );
  }

  private getBody(side: OrderSide, quantity: number): ApiOrderParams {
    return {
      symbol: this.symbol,
      side,
      type: orderTypeCollection.STOP_MARKET,
      quantity
    }
  }

  public createOrder(
    side: OrderSide,
    quantity: number
  ) {
    return new Promise<void>(resolve => {
      const body = this.getBody(side, quantity);
      axios.post<ApiOrderResponse>(
        this.requestUrl,
        body
      )
      .then(response => {
        telegramBot.sendMessage(
          messageService.requestLogMessage(
            this.method,
            this.eventName,
            body,
            response.data
          ),
          TG_TEST_CHAT_ID
        );
      })
      .catch((error) => {
        telegramBot.sendMessage(
          `Failed to make an order\n${JSON.stringify(body)}\n${error}`,
          TG_CHAT_ID
        );
      });
    });
  }
}