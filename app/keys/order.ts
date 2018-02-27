import { OrderSideCollection, OrderTypeCollection, TimeForceCollection } from '../interfaces/order.model';

export const orderSideCollection: OrderSideCollection = Object.freeze<OrderSideCollection>({
  BUY: 'buy',
  SELL: 'sell'
});

export const orderTypeCollection: OrderTypeCollection = Object.freeze<OrderTypeCollection>({
  LIMIT: 'limit',
  MARKET: 'market',
  STOP_LIMIT: 'stopLimit',
  STOP_MARKET: 'stopMarket'
});

export const timeForceCollection: TimeForceCollection = Object.freeze<TimeForceCollection>({
  GTC: 'GTC',
  IOC: 'IOC',
  FOK: 'FOK',
  DAY: 'Day',
  GTD: 'GTD'
})
