import { CurrenciesParams } from "../interfaces/currency.model";

/**
 * HIT BTC API KEYS
 */

export const PUBLIC_API_TOKEN: string = 'f5150f1c0b4f407a0f14247fd487f89e';

export const SECRET_API_TOKEN: string = 'cd5f4b960c4bd4032682f018a80f7d9e';

export const WS_API_PATH: string = 'wss://api.hitbtc.com/api/2/ws';

export const REST_API_PATH: string =  'https://api.hitbtc.com/api/2/public';

export const PERSONALIZED_REST_API_PATH: string = `https://${PUBLIC_API_TOKEN}:${SECRET_API_TOKEN}@api.hitbtc.com/api/2`

export const DEFAULT_ID: number = 123;

/**
 * TELEGRAM BOT API KEYS
 */
export const TG_TOKEN: string = '538794728:AAH9p99NRQ6fCpzXC8YKsAjr8ZxK4ri58SI';

export const TG_API_PATH: string = `https://api.telegram.org/bot${TG_TOKEN}`;

export const TG_CHAT_ID: string = '-246951427';

export const TG_TEST_CHAT_ID: string = '-291598333';

export const CURRENCIES_PAIR: CurrenciesParams = {
  base: 'ETH',
  quote: 'USD'
};


/**
 * One of: M1 (one minute), M3, M5, M15, M30, H1, H4, D1, D7, 1M (one month).
 * Default is M30 (30 minutes).
 */
type CandlesPeriod = 'M1' | 'M3' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1' | 'D7' | '1M'

const MINUTES_INTERVAL = 1;

export const MS_INTERVAL: number = 1000 * 60 * MINUTES_INTERVAL;

// export const CANDLES_INITIAL_QUANTITY: number = (12 * 60) / MINUTES_INTERVAL; // For 12 hrs
export const CANDLES_INITIAL_QUANTITY: number = 100;

export const CANDLES_PERIOD: CandlesPeriod = `M${MINUTES_INTERVAL}` as CandlesPeriod;
