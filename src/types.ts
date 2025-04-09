export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: number; // Unix timestamp in milliseconds
  readAt: number | null; // Unix timestamp in milliseconds
}

export interface User {
  id: string;
  name: string;
}

// No longer needed as we're using real timestamps
// export interface LogicalClock {
//   timestamp: number;
// }