import React, { useState, useEffect } from 'react';
import { Message, User } from '../types';
import { LamportClock } from '../utils/clock';
import { StorageService } from '../utils/storage';

interface ChatWindowProps {
  currentUser: User;
  otherUser: User;
  clock: LamportClock;
}

export function ChatWindow({ currentUser, otherUser, clock }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const loadMessages = () => {
      const allMessages = StorageService.getMessages();
      const relevantMessages = allMessages.filter(
        msg => 
          (msg.senderId === currentUser.id && msg.receiverId === otherUser.id) ||
          (msg.senderId === otherUser.id && msg.receiverId === currentUser.id)
      );
      setMessages(relevantMessages);

      // Mark received messages as read with current timestamp
      relevantMessages.forEach(msg => {
        if (msg.receiverId === currentUser.id && !msg.readAt) {
          const readTimestamp = Date.now();
          StorageService.updateMessageReadStatus(msg.id, readTimestamp);
        }
      });
    };

    loadMessages();
    // Poll for new messages every second
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, [currentUser.id, otherUser.id]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: crypto.randomUUID(),
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content: newMessage,
      sentAt: Date.now(), // Use current timestamp
      readAt: null
    };

    StorageService.saveMessage(message);
    setNewMessage('');
  };

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(new Date(timestamp));
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat with {otherUser.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.senderId === currentUser.id ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === currentUser.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Sent: {formatTime(message.sentAt)}
              {message.readAt && ` • Read: ${formatTime(message.readAt)}`}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}