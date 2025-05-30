import React, { useState, useEffect } from 'react';
import messageService from '../services/messageService';
import { Chat, Message, User } from '../types/types';

interface MessageSidebarProps {
  userId: string; // Current logged-in user's ID
  onSelectChat: (chatId: string, messages: Message[], otherUser: User) => void; // Callback to handle chat selection
}

const MessageSidebar: React.FC<MessageSidebarProps> = ({ userId, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]); // State for chat relationships
  const [messagesCache, setMessagesCache] = useState<Record<string, Message[]>>({}); // Cache for messages
  const [searchResults, setSearchResults] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null); // Track the active chat ID

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await messageService.getUserChats(userId);

        console.log(response);

        setChats(response.chats);
        setSearchResults(response.chats); // Initialize search results
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [userId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Filter chats based on the search query
    const results = chats.filter((chat) =>
      chat.userA.username.toLowerCase().includes(query.toLowerCase()) ||
      chat.userB.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectChat = async (chat: Chat) => {
    const otherUser = chat.userA.id === userId ? chat.userB : chat.userA;

    // Set the active chat ID
    setActiveChatId(chat.id);

    // Check if messages are already cached
    if (messagesCache[chat.id]) {
      onSelectChat(chat.id, messagesCache[chat.id], otherUser);
    } else {
      try {
        const response = await messageService.getChatMessages(userId, otherUser.id);
        const messages = response.chat.messages;
        setMessagesCache((prevCache) => ({ ...prevCache, [chat.id]: messages })); // Cache messages
        onSelectChat(chat.id, messages, otherUser);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  return (
    <div className="w-1/4 h-full bg-gray-100 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Chats</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search friends..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Search Results */}
      {searchQuery && (
        <ul className="mb-4">
          {searchResults.map((chat) => {
            const otherUser = chat.userA.id === userId ? chat.userB : chat.userA;
            return (
              <li
                key={chat.id}
                className={`p-3 mb-2 rounded-lg shadow flex justify-between items-center cursor-pointer ${
                  activeChatId === chat.id ? 'bg-blue-200' : 'bg-white hover:bg-gray-200'
                }`}
                onClick={() => handleSelectChat(chat)}
              >
                <span>{otherUser.username}</span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Past Conversations */}
      <h3 className="text-md font-semibold mb-2">Past Conversations</h3>
      <ul className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const otherUser = chat.userA.id === userId ? chat.userB : chat.userA;
          return (
            <li
              key={chat.id}
              className={`p-3 mb-2 rounded-lg shadow cursor-pointer ${
                activeChatId === chat.id ? 'bg-blue-200' : 'bg-white hover:bg-gray-200'
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              {otherUser.username}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MessageSidebar;