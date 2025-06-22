export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export class ConversationManager {
  private static conversations: Map<number, ConversationMessage[]> = new Map();
  private static readonly MAX_HISTORY_LENGTH = 20; // Keep last 20 messages per chat
  private static readonly MAX_AGE_HOURS = 24; // Clear conversations older than 24 hours

  /**
   * Add a message to the conversation history for a specific chat
   */
  static addMessage(chatId: number, role: 'user' | 'assistant', content: string): void {
    if (!this.conversations.has(chatId)) {
      this.conversations.set(chatId, []);
    }

    const conversation = this.conversations.get(chatId)!;
    const message: ConversationMessage = {
      role,
      content,
      timestamp: Date.now(),
    };

    conversation.push(message);

    // Keep only the last MAX_HISTORY_LENGTH messages
    if (conversation.length > this.MAX_HISTORY_LENGTH) {
      conversation.splice(0, conversation.length - this.MAX_HISTORY_LENGTH);
    }

    // Clean up old conversations periodically
    this.cleanupOldConversations();
  }

  /**
   * Get conversation history for a specific chat
   */
  static getHistory(chatId: number): ConversationMessage[] {
    return this.conversations.get(chatId) || [];
  }

  /**
   * Get conversation history formatted for Claude API
   */
  static getFormattedHistory(chatId: number): Array<{ role: 'user' | 'assistant'; content: string }> {
    const history = this.getHistory(chatId);
    return history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Clear conversation history for a specific chat
   */
  static clearHistory(chatId: number): void {
    this.conversations.delete(chatId);
  }

  /**
   * Get the number of active conversations
   */
  static getActiveConversationCount(): number {
    return this.conversations.size;
  }

  /**
   * Clean up conversations older than MAX_AGE_HOURS
   */
  private static cleanupOldConversations(): void {
    const cutoffTime = Date.now() - (this.MAX_AGE_HOURS * 60 * 60 * 1000);
    
    for (const [chatId, conversation] of this.conversations.entries()) {
      // Remove old messages from conversation
      const filteredConversation = conversation.filter(msg => msg.timestamp > cutoffTime);
      
      if (filteredConversation.length === 0) {
        // If no messages remain, remove the entire conversation
        this.conversations.delete(chatId);
      } else {
        // Update with filtered conversation
        this.conversations.set(chatId, filteredConversation);
      }
    }
  }

  /**
   * Get conversation statistics for debugging
   */
  static getStats(): {
    activeConversations: number;
    totalMessages: number;
    oldestMessage: number | null;
  } {
    let totalMessages = 0;
    let oldestMessage: number | null = null;

    for (const conversation of this.conversations.values()) {
      totalMessages += conversation.length;
      
      for (const message of conversation) {
        if (oldestMessage === null || message.timestamp < oldestMessage) {
          oldestMessage = message.timestamp;
        }
      }
    }

    return {
      activeConversations: this.conversations.size,
      totalMessages,
      oldestMessage,
    };
  }
} 