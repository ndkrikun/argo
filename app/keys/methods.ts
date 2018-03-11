interface WsMethodsKeys {
  SUBSCRIBE_TICKER: string;
}

interface RestMethodsKeys {
  GET_CURRENCY: string;
  GET_SYMBOL: string;
  GET_CANDELS: string;
  CREATE_ORDER: string;
  GET_BALANCE: string;
}

interface TgBotMethodsKeys {
  GET_UPDATES: string;
  SEND_MESSAGE: string;
}

export const wsMethodsKeys: WsMethodsKeys = {
  SUBSCRIBE_TICKER: 'subscribeTicker',
}

export const restMethodsKeys: RestMethodsKeys = {
  GET_CURRENCY: '/currency',
  GET_SYMBOL: '/symbol',
  GET_CANDELS: '/candles',
  CREATE_ORDER: '/order',
  GET_BALANCE: '/trading/balance',
}

export const tgBotMethodsKeys: TgBotMethodsKeys = {
  GET_UPDATES: '/getUpdates',
  SEND_MESSAGE: '/sendMessage',
}