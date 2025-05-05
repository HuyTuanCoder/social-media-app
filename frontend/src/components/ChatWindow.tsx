import React, { useState } from 'react';
import { Message, User } from '../types/types';
import messageService from '../services/messageService';

interface ChatWindowProps {
  chatId: string | null;
  messages: Message[] | null;
  currentUser: User | null;
  otherUser?: User | null; // Add the other user's information
  onNewMessage: (newMessage: Message) => void; // Callback to update messages in parent
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, messages, currentUser, otherUser, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState(''); // State for the new message input

  if (!chatId || !messages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a chat to view messages</p>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !otherUser) return;

    try {
      const response = await messageService.sendMessage(currentUser.id, otherUser.id, newMessage);
      onNewMessage(response); // Update messages in the parent component
      setNewMessage(''); // Clear the input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col">
      {/* Display the other user's username at the top */}
      <h2 className="text-lg font-bold mb-4 text-center">{otherUser?.username || 'Chat'}</h2>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg break-words ${
                message.senderId === currentUser?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Send Message Section */}
      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;