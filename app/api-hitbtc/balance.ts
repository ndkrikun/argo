import { restMethodsKeys } from '../keys/methods';
import { Balance } from '../interfaces/currency.model';
import axios, { AxiosResponse } from 'axios';
import { AUTH_REST_API_PATH } from '../keys/main';
import { RestApiMethod } from '../interfaces/api.model';

const QueryString = require('query-string')

export class BalanceAPI {
  private readonly eventName = restMethodsKeys.GET_BALANCE;
  private readonly method: RestApiMethod = 'GET';

  private get requestUrl(): string {
    return (
      AUTH_REST_API_PATH + this.eventName
    );
  }

  public getBalance() {
    return new Promise<Balance[]>(resolve => {
      axios.get<Balance[]>(
        this.requestUrl
      )
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        console.log(`Failed to get balance. ${error}`)
      });
    });
  }

}
