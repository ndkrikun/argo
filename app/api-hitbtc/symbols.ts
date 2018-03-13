import { restMethodsKeys } from '../keys/methods';
import { CurrencySymbol, CurrencySymbolData } from '../interfaces/currency.model';
import axios from 'axios';
import { REST_API_PATH, TG_CHAT_ID, CURRENCIES_PAIR } from '../keys/main';
import { RestApiMethod } from '../interfaces/api.model';
import { telegramBot } from '../api-telegram/index';

const QueryString = require('query-string')

export class SymbolsAPI {
  private readonly eventName = restMethodsKeys.GET_SYMBOL;
  private readonly method: RestApiMethod = 'GET';

  private get symbol(): CurrencySymbol {
    return CURRENCIES_PAIR.symbol;
  }

  private get requestUrl(): string {
    return (
      REST_API_PATH + this.eventName + '/' + this.symbol
    );
  }

  public getSymbol() {
    return new Promise<CurrencySymbolData>(resolve => {
      axios.get<CurrencySymbolData>(
        this.requestUrl,
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        telegramBot.sendMessage(
          `Failed to get symbol data \n${error}`,
          TG_CHAT_ID
        );
      });
    });
  }

}