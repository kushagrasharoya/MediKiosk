export interface ApiErrorResponse {
  detail: string | { msg: string; type: string }[];
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  environment: string;
  database: string;
}
