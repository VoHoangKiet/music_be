export interface ENV {
  HOST: string | undefined;
  PORT: number | undefined;
  NODE_ENV: string | undefined;
  CONTEXT_PATH: string | undefined;
  JWT_KEY: string | undefined;
  JWT_REFRESH_KEY: string | undefined;
  MONGO_URL: string | undefined;
  STRIPE_SECRET: string | undefined;
  ENDPOINT_SECRET: string | undefined;
}
