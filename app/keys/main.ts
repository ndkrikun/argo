export const WS_API_PATH: string = 'wss://api.hitbtc.com/api/2/ws';

export const REST_API_PATH: string =  'https://api.hitbtc.com/api/2/public';

export const DEFAULT_ID: number = 123;

export const ACCESS_TOKEN: string = 'asdfa3ofaasodfai32iasdfasf';


/**
 * One of: M1 (one minute), M3, M5, M15, M30, H1, H4, D1, D7, 1M (one month).
 * Default is M30 (30 minutes).
 */
type CandlesPeriod = 'M1' | 'M3' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1' | 'D7' | '1M'

const MINUTES_INTERVAL = 3;

export const MS_INTERVAL: number = 1000 * 60 * MINUTES_INTERVAL;

export const CANDLES_QUANTITY: number = (24 * 60) / MINUTES_INTERVAL; // Max 1000

export const CANDLES_PERIOD: CandlesPeriod = `M${MINUTES_INTERVAL}` as CandlesPeriod;
