
export type OrderType = 'buy' | 'sell';

export interface OrderTypeCollection {
  BUY: OrderType;
  SELL: OrderType;
}

export const orderTypeCollection: OrderTypeCollection = {
  BUY: 'buy',
  SELL: 'sell'
}
