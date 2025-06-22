import { config } from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

// Load environment variables from .env file
config();

export const env = cleanEnv(process.env, {
  // Telegram Bot Token (required)
  TELEGRAM_BOT_TOKEN: str({
    desc: 'Telegram Bot Token from @BotFather',
    example: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
  }),

  // Anthropic API Key (required for Claude integration)
  ANTHROPIC_API_KEY: str({
    desc: 'Anthropic API Key for Claude access',
    example: 'sk-ant-api03-...',
  }),

  // Optional: Bot configuration
  BOT_USERNAME: str({
    desc: 'Bot username (without @)',
    default: '',
  }),

  // Optional: Server configuration
  PORT: port({
    desc: 'Port for webhook server (if using webhooks)',
    default: 3000,
  }),

  // Optional: Database configuration
  DATABASE_URL: str({
    desc: 'Database connection URL',
    default: '',
  }),

  // Optional: Logging level
  LOG_LEVEL: str({
    desc: 'Logging level',
    choices: ['error', 'warn', 'info', 'debug'],
    default: 'info',
  }),

  // Optional: Environment
  NODE_ENV: str({
    desc: 'Node environment',
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
});

// Export individual variables for convenience
export const {
  TELEGRAM_BOT_TOKEN,
  ANTHROPIC_API_KEY,
  BOT_USERNAME,
  PORT,
  DATABASE_URL,
  LOG_LEVEL,
  NODE_ENV,
} = env; 