export type OrderSide = 'buy' | 'sell';

export type OrderType = 'limit' | 'market' | 'stopLimit' | 'stopMarket';

export type TimeForce = 'GTC' | 'IOC' | 'FOK' | 'Day' | 'GTD';

export interface OrderSideCollection {
  BUY: OrderSide;
  SELL: OrderSide;
}

export interface OrderTypeCollection {
  LIMIT: OrderType;
  MARKET: OrderType;
  STOP_LIMIT: OrderType;
  STOP_MARKET: OrderType;
}

export interface TimeForceCollection {
  GTC: TimeForce;
  IOC: TimeForce;
  FOK: TimeForce;
  DAY: TimeForce;
  GTD: TimeForce;
}
