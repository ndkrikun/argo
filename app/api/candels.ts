import { restMethodsKeys } from '../keys/methods';
import { CurrenciesParams, TickerSymbol, Candel } from '../interfaces/currency.model';
import axios, { AxiosResponse } from 'axios';
import { REST_API_PATH } from '../keys/main';

const QueryString = require('query-string')

interface ApiCandelsParams {
  limit: number;
  period: string;
}

export class CandlesService {
  private readonly eventName = restMethodsKeys.GET_CANDELS;
  private readonly limit: number = 100;
  private readonly period: string = 'M3';

  constructor(
    private readonly params: CurrenciesParams,
  ) {
  }

  private get symbol(): TickerSymbol {
    return (
      this.params.from + this.params.to
    ) as TickerSymbol
  }

  private get apiParams(): ApiCandelsParams {
    return {
      limit: this.limit,
      period: this.period
    };
  }

  private get requestUrl(): string {
    return (
      REST_API_PATH + this.eventName + '/' + this.symbol
    );
  }

  public getCandels() {
    const method = 'GET';
    const url = this.requestUrl;

    console.log(this.requestUrl, this.apiParams)

    axios.get(this.requestUrl, { params: this.apiParams })
    .then((response) => {
      console.log(response.data);
    })
  }

}