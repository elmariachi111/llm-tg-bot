import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import TelegramBot from "node-telegram-bot-api";
import { LOG_LEVEL, NODE_ENV, TELEGRAM_BOT_TOKEN } from "./src/env";

const main = async () => {
  await configure({
    sinks: { console: getConsoleSink() },
    loggers: [
      { category: "llm-tg-bot", lowestLevel: "debug", sinks: ["console"] },
      {
        category: ["logtape", "meta"],
        sinks: ["console"],
        lowestLevel: "error",
      },
    ],
  });

  const logger = getLogger(["llm-tg-bot"]);

  // Create a bot that uses 'polling' to fetch new updates
  const bot: TelegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
    polling: true,
  });

  // Log startup information
  console.log(
    `🚀 Bot starting in ${NODE_ENV} mode with log level: ${LOG_LEVEL}`
  );

  // Handle /start command
  bot.onText(/\/start/, (msg: TelegramBot.Message) => {
    const chatId: number = msg.chat.id;
    logger.info(`/start`, { chatId });

    bot.sendMessage(
      chatId,
      "Hello! I am your Telegram bot. How can I help you?"
    );
  });

  // Handle /help command
  bot.onText(/\/help/, (msg: TelegramBot.Message) => {
    const chatId: number = msg.chat.id;
    logger.info(`/help`, { chatId });
    bot.sendMessage(
      chatId,
      "Available commands:\n/start - Start the bot\n/help - Show this help message"
    );
  });

  // Handle regular messages
  bot.on("message", (msg: TelegramBot.Message) => {
    const chatId: number = msg.chat.id;
    logger.info(`message`, { chatId });

    if (msg.text && !msg.text.startsWith("/")) {
      bot.sendMessage(chatId, `You said: ${msg.text}`);
    }
  });

  // Handle bot errors
  bot.on("error", (error: Error) => {
    console.error("Bot error:", error);
  });

  // Handle polling errors
  bot.on("polling_error", (error: Error) => {
    console.error("Polling error:", error);
  });

  console.log("✅ Bot is running and ready to receive messages...");
};

main();
