export interface ApiError {
  code: number;
  message: string;
  description: string;
}

export interface ApiResponse<T> {
  jsonrpc: string;
  method: string;
  params: T;
}

export type RestApiMethod = 'GET' | 'POST';