export type CurrencyId = (
  'BTC' |
  'ETH' |
  'USD' |
  'XRP' |
  'TRX'
)

export type CurrencySymbol = (
  'ETHBTC' |
  'BTCETH' |
  'ETHUSD' |
  'XRPUSDT' |
  'TRXUSD'
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
  symbol: CurrencySymbol;
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
  base: CurrencyId;
  quote: CurrencyId;
  symbol: CurrencySymbol;
}

export interface Balance {
  currency: CurrencyId;
  available: string;
  reserved: string;
}

export interface CurrencySymbolData {
  id: CurrencySymbol;
  baseCurrency: CurrencyId;
  quoteCurrency: CurrencyId;
  quantityIncrement: string;
  tickSize: string;
  takeLiquidityRate: string;
  provideLiquidityRate: string;
  feeCurrency: CurrencyId;
}