import { config as loadEnv } from "dotenv";

loadEnv();

export interface Config {
  telegram: {
    botToken: string;
  };
  openai: {
    apiKey: string;
  };
  database: {
    url: string;
  };
  app: {
    notificationInterval: number; // in milliseconds
    defaultNewsCheckInterval: number; // in minutes
    maxSubscriptionsPerUser: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

export const config: Config = {
  telegram: {
    botToken: getRequiredEnv("BOT_TOKEN"),
  },
  openai: {
    apiKey: getRequiredEnv("OPENAI_API_KEY"),
  },
  database: {
    url: getOptionalEnv("DATABASE_URL", "sqlite://macchiato.db"),
  },
  app: {
    notificationInterval: parseInt(getOptionalEnv("NOTIFICATION_CHECK_INTERVAL", "60000"), 10), // 1 minute default
    defaultNewsCheckInterval: parseInt(getOptionalEnv("DEFAULT_NEWS_CHECK_INTERVAL", "30"), 10), // 30 minutes default
    maxSubscriptionsPerUser: parseInt(getOptionalEnv("MAX_SUBSCRIPTIONS_PER_USER", "10"), 10),
    logLevel: getOptionalEnv("LOG_LEVEL", "info") as Config["app"]["logLevel"],
  },
};

// Helper function to get required environment variables
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is missing`);
  }
  return value;
}

// Helper function to get optional environment variables with default value
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export default config;