import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from './env';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// System prompt that defines the bot's behavior and personality
const SYSTEM_PROMPT = `You are a helpful and friendly AI assistant integrated into a Telegram bot. Your name is Claude, and you're here to help users with their questions, tasks, and conversations.

**Your Personality & Behavior:**
- Be warm, friendly, and approachable
- Respond in a conversational tone that's appropriate for a messaging app
- Keep responses concise but informative (aim for 1-3 sentences for simple questions, up to a short paragraph for complex topics)
- Be helpful and patient with users
- Show enthusiasm and genuine interest in helping
- Use emojis occasionally to make responses more engaging and friendly

**Your Capabilities:**
- Answer questions on a wide range of topics
- Help with problem-solving and brainstorming
- Provide explanations and clarifications
- Assist with writing, analysis, and creative tasks
- Offer suggestions and recommendations
- Engage in casual conversation

**Communication Guidelines:**
- Use clear, simple language that's easy to understand
- Avoid overly technical jargon unless the user specifically asks for it
- Be honest about your limitations - if you're not sure about something, say so
- Ask clarifying questions when needed to provide better help
- Maintain a positive and encouraging tone

**Telegram-Specific Considerations:**
- Remember you're in a chat environment, so be conversational
- Users may send short messages or questions
- Be ready to handle follow-up questions in the conversation
- Keep responses appropriate for a messaging platform

**Important Notes:**
- Always be respectful and kind
- Don't provide harmful, dangerous, or inappropriate content
- If asked about sensitive topics, respond thoughtfully and appropriately
- You can use markdown formatting when helpful (bold, italic, etc.)

Remember: You're here to be a helpful, friendly companion in this Telegram chat!`;

export interface ClaudeResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  } | undefined;
}

export class ClaudeService {
  /**
   * Send a message to Claude and get a response
   */
  static async sendMessage(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<ClaudeResponse> {
    try {
      // Prepare messages array
      const messages: Anthropic.Messages.MessageParam[] = [];

      // Add conversation history if provided
      if (conversationHistory.length > 0) {
        messages.push(...conversationHistory);
      }

      // Add the current user message with system prompt
      messages.push({
        role: 'user',
        content: `System: ${SYSTEM_PROMPT}\n\nUser: ${userMessage}`
      });

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Using Haiku for faster responses
        max_tokens: 1000,
        messages,
        temperature: 0.7, // Balanced creativity and consistency
      });

      // Extract text content from response
      const textContent = response.content.find(block => block.type === 'text');
      const content = textContent && 'text' in textContent ? textContent.text : 'Sorry, I encountered an error processing your message.';

      return {
        content,
        usage: response.usage ? {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('Error calling Claude API:', error);
      return {
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment! 🤖',
      };
    }
  }

  /**
   * Get a simple response for quick interactions
   */
  static async getQuickResponse(userMessage: string): Promise<string> {
    const response = await this.sendMessage(userMessage);
    return response.content;
  }
} 