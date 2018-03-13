import { restMethodsKeys } from '../keys/methods';
import { CurrenciesParams, CurrencySymbol, Candle } from '../interfaces/currency.model';
import axios, { AxiosResponse } from 'axios';
import { REST_API_PATH, CANDLES_PERIOD, CURRENCIES_PAIR } from '../keys/main';
import { RestApiMethod } from '../interfaces/api.model';

const QueryString = require('query-string')

interface ApiCandelsParams {
  limit: number;
  period: string;
}

export class CandlesAPI {
  private readonly eventName = restMethodsKeys.GET_CANDELS;
  private readonly method: RestApiMethod = 'GET';

  private readonly period: string = CANDLES_PERIOD;

  private get symbol(): CurrencySymbol {
    return CURRENCIES_PAIR.symbol;
  }

  private getParams(
    quantity: number
  ): ApiCandelsParams {
    return {
      limit: quantity,
      period: this.period
    };
  }

  private get requestUrl(): string {
    return (
      REST_API_PATH + this.eventName + '/' + this.symbol
    );
  }

  public getCandels(
    quantity: number = 1
  ) {
    return new Promise<Candle[]>(resolve => {
      axios.get<Candle[]>(
        this.requestUrl,
        { params: this.getParams(quantity) }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(`Failed to get ${quantity} candles. ${error}`)
      });
    });
  }

}