

interface WsMethodsKeys {
  SUBSCRIBE_TICKER: string;
}

interface RestMethodsKeys {
  GET_CURRENCY: string;
  GET_SYMBOL: string;
  GET_CANDELS: string;
}

const SUBSCRIBE_TICKER = 'subscribeTicker';

const GET_CURRENCY = '/currency';
const GET_SYMBOL = '/symbol';
const GET_CANDELS = '/candles';

export const wsMethodsKeys: WsMethodsKeys = {
  SUBSCRIBE_TICKER,
}

export const restMethodsKeys: RestMethodsKeys = {
  GET_CURRENCY,
  GET_SYMBOL,
  GET_CANDELS,
}
