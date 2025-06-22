# Telegram Bot

A TypeScript-based Telegram bot with environment variable validation.

## Features

- ✅ TypeScript support with strict type checking
- ✅ Environment variable validation using `envalid`
- ✅ Support for `.env` files
- ✅ Comprehensive error handling
- ✅ Development and production modes

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` and set your Telegram bot token:

```env
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
```

#### Required Environment Variables

- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token from @BotFather

#### Optional Environment Variables

- `BOT_USERNAME` - Your bot's username (without @)
- `PORT` - Port for webhook server (default: 3000)
- `DATABASE_URL` - Database connection URL
- `LOG_LEVEL` - Logging level: error, warn, info, debug (default: info)
- `NODE_ENV` - Environment: development, production, test (default: development)

### 3. Get a Telegram Bot Token

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the token provided by BotFather

## Usage

### Development Mode

Run the bot directly with TypeScript:

```bash
pnpm run dev
```

### Production Mode

Build and run the compiled JavaScript:

```bash
# Build the project
pnpm run build

# Run the compiled version
pnpm run start
```

### Watch Mode

Automatically rebuild on file changes:

```bash
pnpm run watch
```

## Environment Validation

The bot uses `envalid` to validate environment variables at startup. If any required variables are missing or incorrectly formatted, the bot will:

1. Display a clear error message listing the missing/invalid variables
2. Show examples of the expected format
3. Exit with error code 1

Example error output:
```
================================
 Missing environment variables:
    TELEGRAM_BOT_TOKEN: Telegram Bot Token from @BotFather (eg. "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz")
================================
```

## Project Structure

```
tg_bot/
├── src/
│   └── env.ts          # Environment variable validation
├── dist/               # Compiled JavaScript (generated)
├── bot.ts              # Main bot file
├── env.example         # Example environment variables
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Available Commands

- `/start` - Start the bot
- `/help` - Show available commands

## Error Handling

The bot includes comprehensive error handling for:
- Missing environment variables
- Bot API errors
- Polling errors
- Invalid message formats

## Development

### TypeScript Configuration

The project uses strict TypeScript configuration with:
- ES2020 target
- CommonJS modules
- Source maps enabled
- Declaration files generated
- Strict type checking

### Adding New Environment Variables

To add new environment variables:

1. Edit `src/env.ts`
2. Add the variable definition with appropriate validation
3. Export it from the destructured object
4. Update `env.example` with the new variable
5. Update this README if needed 