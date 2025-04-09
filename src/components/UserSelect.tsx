import React from 'react';
import { User } from '../types';

interface UserSelectProps {
  users: User[];
  currentUser: User | null;
  otherUser: User | null;
  onSelectUser: (user: User) => void;
}

export function UserSelect({ users, currentUser, otherUser, onSelectUser }: UserSelectProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Select User</h2>
      <div className="space-y-2">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`w-full p-2 rounded flex items-center justify-between ${
              currentUser?.id === user.id
                ? 'bg-blue-500 text-white'
                : otherUser?.id === user.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>{user.name}</span>
            {otherUser?.id === user.id && (
              <span className="text-sm">(Click to switch)</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}