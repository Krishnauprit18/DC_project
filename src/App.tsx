import React, { useState, useEffect } from 'react';
import { User } from './types';
import { LamportClock } from './utils/clock';
import { StorageService } from './utils/storage';
import { UserSelect } from './components/UserSelect';
import { ChatWindow } from './components/ChatWindow';

// Initialize demo users if none exist
const initializeDemoUsers = () => {
  const existingUsers = StorageService.getUsers();
  if (existingUsers.length === 0) {
    const demoUsers: User[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ];
    demoUsers.forEach(user => StorageService.saveUser(user));
    return demoUsers;
  }
  return existingUsers;
};

function App() {
  const [users] = useState<User[]>(initializeDemoUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [clock] = useState(new LamportClock());

  const handleUserSelect = (user: User) => {
    if (!currentUser) {
      setCurrentUser(user);
    } else {
      // If clicking on a user that's not the current user, switch to their perspective
      if (user.id !== currentUser.id) {
        // If there's no other user selected yet, just set them as other user
        if (!otherUser) {
          setOtherUser(user);
        } else {
          // If we click on the other user, swap perspectives
          if (user.id === otherUser.id) {
            setCurrentUser(otherUser);
            setOtherUser(currentUser);
          } else {
            // If we click on a different user, make them the other user
            setOtherUser(user);
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Distributed Chat System
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <UserSelect
              users={users}
              currentUser={currentUser}
              otherUser={otherUser}
              onSelectUser={handleUserSelect}
            />
            {currentUser && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow">
                <p className="font-semibold">Logged in as:</p>
                <p>{currentUser.name}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            {currentUser && otherUser ? (
              <ChatWindow
                currentUser={currentUser}
                otherUser={otherUser}
                clock={clock}
              />
            ) : (
              <div className="h-[600px] bg-white rounded-lg shadow flex items-center justify-center">
                <p className="text-gray-500">
                  {currentUser
                    ? 'Select another user to start chatting'
                    : 'Select your user to begin'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;