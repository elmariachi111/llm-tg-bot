import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import TelegramBot from "node-telegram-bot-api";
import { ClaudeService } from "./src/claude";
import { ConversationManager } from "./src/conversation";
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
    logger.info(`/start {chatId}`, { chatId });

    bot.sendMessage(
      chatId,
      "Hello! I'm Claude, your AI assistant. I'm here to help you with questions, tasks, and conversations. Feel free to ask me anything! 🤖✨"
    );
  });

  // Handle /help command
  bot.onText(/\/help/, (msg: TelegramBot.Message) => {
    const chatId: number = msg.chat.id;
    logger.info(`/help {chatId}`, { chatId });
    bot.sendMessage(
      chatId,
      "Here's what I can help you with:\n\n" +
      "💬 **General Questions** - Ask me anything!\n" +
      "🧠 **Problem Solving** - I can help brainstorm solutions\n" +
      "✍️ **Writing & Analysis** - Need help with text or analysis?\n" +
      "💡 **Creative Tasks** - Let's work on creative projects together\n" +
      "📚 **Explanations** - I can explain complex topics simply\n\n" +
      "**Commands:**\n" +
      "/start - Start a new conversation\n" +
      "/help - Show this help message\n" +
      "/clear - Clear our conversation history\n\n" +
      "Just send me a message and I'll do my best to help! 😊"
    );
  });

  // Handle /clear command
  bot.onText(/\/clear/, (msg: TelegramBot.Message) => {
    const chatId: number = msg.chat.id;
    logger.info(`/clear {chatId}`, { chatId });
    
    // Clear conversation history
    ConversationManager.clearHistory(chatId);
    
    bot.sendMessage(
      chatId,
      "✅ Conversation history cleared! I'll start fresh with our next message. 🧹"
    );
  });

  // Handle regular messages
  bot.on("message", async (msg: TelegramBot.Message) => {
    const chatId: number = msg.chat.id;
    logger.info(`message {chatId}`, { chatId });

    // Handle file uploads first
    if (msg.document || msg.photo || msg.video || msg.audio || msg.voice || msg.video_note) {
      try {
        let fileInfo: { fileId: string; fileName?: string; fileSize?: number; mimeType?: string } | null = null;
        
        if (msg.document) {
          const info: { fileId: string; fileName?: string; fileSize?: number; mimeType?: string } = {
            fileId: msg.document.file_id
          };
          if (msg.document.file_name) info.fileName = msg.document.file_name;
          if (msg.document.file_size) info.fileSize = msg.document.file_size;
          if (msg.document.mime_type) info.mimeType = msg.document.mime_type;
          fileInfo = info;
        } else if (msg.photo && msg.photo.length > 0) {
          // Get the largest photo (last in the array)
          const largestPhoto = msg.photo[msg.photo.length - 1];
          if (largestPhoto) {
            const info: { fileId: string; fileName?: string; fileSize?: number; mimeType?: string } = {
              fileId: largestPhoto.file_id,
              fileName: "photo.jpg",
              mimeType: "image/jpeg"
            };
            if (largestPhoto.file_size) info.fileSize = largestPhoto.file_size;
            fileInfo = info;
          }
        } else if (msg.video) {
          const info: { fileId: string; fileName?: string; fileSize?: number; mimeType?: string } = {
            fileId: msg.video.file_id,
            fileName: "video.mp4"
          };
          if (msg.video.file_size) info.fileSize = msg.video.file_size;
          if (msg.video.mime_type) info.mimeType = msg.video.mime_type;
          fileInfo = info;
        } else if (msg.audio) {
          const info: { fileId: string; fileName?: string; fileSize?: number; mimeType?: string } = {
            fileId: msg.audio.file_id,
            fileName: msg.audio.title || "audio.mp3"
          };
          if (msg.audio.file_size) info.fileSize = msg.audio.file_size;
          if (msg.audio.mime_type) info.mimeType = msg.audio.mime_type;
          fileInfo = info;
        } else if (msg.voice) {
          const info: { fileId: string; fileName?: string; fileSize?: number; mimeType?: string } = {
            fileId: msg.voice.file_id,
            fileName: "voice_message.ogg",
            mimeType: "audio/ogg"
          };
          if (msg.voice.file_size) info.fileSize = msg.voice.file_size;
          fileInfo = info;
        } else if (msg.video_note) {
          const info: { fileId: string; fileName?: string; fileSize?: number; mimeType?: string } = {
            fileId: msg.video_note.file_id,
            fileName: "video_note.mp4",
            mimeType: "video/mp4"
          };
          if (msg.video_note.file_size) info.fileSize = msg.video_note.file_size;
          fileInfo = info;
        }

        if (fileInfo) {
          // Get the actual file from Telegram
          const file = await bot.getFile(fileInfo.fileId);
          
          // Escape special characters that could break Markdown
          const escapeMarkdown = (text: string | undefined): string => {
            if (!text) return 'Unknown';
            return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
          };
          
          // Create a formatted response message with escaped content
          const responseMessage = `📁 File Upload Received!\n\n` +
            `File Details:\n` +
            `• File Name: ${escapeMarkdown(fileInfo.fileName)}\n` +
            `• File Size: ${fileInfo.fileSize || 'Unknown'} bytes\n` +
            `• MIME Type: ${escapeMarkdown(fileInfo.mimeType)}\n` +
            `• File ID: ${escapeMarkdown(fileInfo.fileId)}\n\n` +
            `Thank you for uploading! 🎉`;

          // Send the response to the user (without Markdown parsing)
          await bot.sendMessage(chatId, responseMessage);

          logger.info(`File upload received {chatId} {fileName} {fileSize}`, {
            chatId,
            fileName: fileInfo.fileName,
            fileSize: fileInfo.fileSize,
            mimeType: fileInfo.mimeType,
            filePath: file.file_path
          });

          // Don't process further since we've handled the file upload
          return;
        }
      } catch (error) {
        logger.error(`Error processing file upload`, { chatId, error });
        console.error("Error processing file upload:", error);
        return;
      }
    }

    // Skip processing if it's a command
    if (msg.text && !msg.text.startsWith("/")) {
      try {
        // Show typing indicator
        bot.sendChatAction(chatId, 'typing');
        
        // Add user message to conversation history
        ConversationManager.addMessage(chatId, 'user', msg.text);
        
        // Get conversation history for context
        const conversationHistory = ConversationManager.getFormattedHistory(chatId);
        
        // Get response from Claude with conversation history
        const response = await ClaudeService.sendMessage(msg.text, conversationHistory);
        
        // Add Claude's response to conversation history
        ConversationManager.addMessage(chatId, 'assistant', response.content);
        
        // Send the response
        await bot.sendMessage(chatId, response.content);
        
        logger.info(`Claude response sent {chatId} {messageLength} {historyLength}`, { 
          chatId, 
          messageLength: response.content.length,
          historyLength: conversationHistory.length + 1 // +1 for current message
        });
      } catch (error) {
        logger.error(`Error processing message with Claude`, { chatId, error });
        await bot.sendMessage(
          chatId, 
          "Sorry, I encountered an error while processing your message. Please try again! 🤖"
        );
      }
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
  console.log("🤖 Claude AI integration is active!");
};

main();
