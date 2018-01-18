export type CurrencySymbol = (
  'ETH' |
  'BTC' |
  'ETHBTC'
);

export interface Currency {
  id: CurrencySymbol;
  fullName: string;
  crypto: boolean;
  payinEnabled: boolean;
  payinPaymentId: boolean;
  payinConfirmations: number;
  payoutEnabled: boolean;
  payoutIsPaymentId: boolean;
  transferEnabled: boolean;
}

export interface CurrencyTicker {
  ask: number;
  bid: number;
  last: number;
  open: number;
  low: number;
  high: number;
  volume: number;
  volumeQuote: number;
  timestamp: Date;
  symbol: CurrencySymbol;
}
