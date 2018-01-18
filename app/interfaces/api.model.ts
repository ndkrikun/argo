export interface ApiError {
  code: number;
  message: string;
  description: string;
}

export interface ApiResponse {
  jsonrpc: string;
  result?: object;
  error?: ApiError;
  id: number
}
