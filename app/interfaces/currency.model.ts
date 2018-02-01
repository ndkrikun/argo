export type CurrencyId = (
  'BTC' |
  'ETH' |
  'USD'
)

export type Symbol = (
  'ETHBTC' |
  'BTCETH' |
  'ETHUSD'
);

export interface Currency {
  id: CurrencyId;
  fullName: string;
  crypto: boolean;
  payinEnabled: boolean;
  payinPaymentId: boolean;
  payinConfirmations: number;
  payoutEnabled: boolean;
  payoutIsPaymentId: boolean;
  transferEnabled: boolean;
}

export interface Ticker {
  ask: number;
  bid: number;
  last: number;
  open: number;
  low: number;
  high: number;
  volume: number;
  volumeQuote: number;
  timestamp: Date;
  symbol: Symbol;
}

export interface Candle {
  timestamp: string;
  open: string;
  close: string;
  min: string;
  max: string;
  volume: string;
  volumeQuote: string;
}

export interface CurrenciesParams {
  base: CurrencyId,
  quote: CurrencyId
}