# Telegram Bot with Claude AI

A TypeScript-based Telegram bot powered by Claude AI (Anthropic) with intelligent conversation capabilities.

## Features

- ✅ TypeScript support with strict type checking
- ✅ Claude AI integration for intelligent responses
- ✅ Environment variable validation using `envalid`
- ✅ Support for `.env` files
- ✅ Comprehensive error handling
- ✅ Development and production modes
- ✅ Friendly AI assistant personality

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

Edit `.env` and set your required tokens:

```env
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

#### Required Environment Variables

- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token from @BotFather
- `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude access

#### Optional Environment Variables

- `BOT_USERNAME` - Your bot's username (without @)
- `PORT` - Port for webhook server (default: 3000)
- `DATABASE_URL` - Database connection URL
- `LOG_LEVEL` - Logging level: error, warn, info, debug (default: info)
- `NODE_ENV` - Environment: development, production, test (default: development)

### 3. Get Required API Keys

#### Telegram Bot Token
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the token provided by BotFather

#### Anthropic API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

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

## Claude AI Integration

The bot is powered by Claude AI (Anthropic's Haiku model) and features:

### Personality & Behavior
- **Friendly & Approachable**: Warm, conversational tone
- **Concise Responses**: Optimized for messaging platforms
- **Helpful & Patient**: Always ready to assist users
- **Engaging**: Uses emojis and friendly language

### Capabilities
- **General Questions**: Answer questions on any topic
- **Problem Solving**: Help brainstorm solutions
- **Writing & Analysis**: Assist with text and analysis tasks
- **Creative Tasks**: Support creative projects
- **Explanations**: Explain complex topics simply
- **Casual Conversation**: Engage in friendly chat

### System Prompt
The bot uses a carefully crafted system prompt that defines its personality, capabilities, and communication guidelines. The prompt ensures the bot:
- Maintains a consistent, friendly personality
- Provides appropriate responses for a messaging platform
- Uses clear, accessible language
- Respects user boundaries and safety guidelines

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
    ANTHROPIC_API_KEY: Anthropic API Key for Claude access (eg. "sk-ant-api03-...")
================================
```

## Project Structure

```
llm-tg-bot/
├── src/
│   ├── env.ts          # Environment variable validation
│   └── claude.ts       # Claude AI service integration
├── dist/               # Compiled JavaScript (generated)
├── bot.ts              # Main bot file
├── env.example         # Example environment variables
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Available Commands

- `/start` - Start the bot and get a welcome message
- `/help` - Show Claude's capabilities and features

## Error Handling

The bot includes comprehensive error handling for:
- Missing environment variables
- Bot API errors
- Claude API errors
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

### Customizing Claude's Behavior

To modify Claude's personality or capabilities:

1. Edit the `SYSTEM_PROMPT` in `src/claude.ts`
2. Adjust the model parameters (temperature, max_tokens) as needed
3. Consider the bot's intended use case and audience 