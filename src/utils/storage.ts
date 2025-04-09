import { Message, User } from '../types';

const MESSAGES_KEY = 'chat_messages';
const USERS_KEY = 'chat_users';

export const StorageService = {
  // Message operations
  getMessages(): Message[] {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  },

  saveMessage(message: Message): void {
    const messages = this.getMessages();
    messages.push(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  },

  updateMessageReadStatus(messageId: string, readAt: number): void {
    const messages = this.getMessages();
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, readAt } : msg
    );
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
  },

  // User operations
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};