import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import MessageSidebar from './components/MessageSidebar';
import ChatWindow from './components/ChatWindow';
import Friends from './components/Friends';
import Profile from './components/Profile';
import Report from './components/Report';
import { User, Message } from './types/types'; // Import User and Message types

const App = (): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Store the logged-in user's data
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null); // Track the selected chat
  const [messages, setMessages] = useState<Message[] | null>(null); // Store messages for the selected chat

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setCurrentUser(user); // Set the current user
      setIsLoggedIn(true); // Set login state to true
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user); // Set the logged-in user's data
    setIsLoggedIn(true); // Set login state to true
    window.localStorage.setItem('loggedUser', JSON.stringify(user)); // Store user in localStorage
  };

  const handleSignUp = (user: User) => {
    setCurrentUser(user); // Set the newly signed-up user's data
    setIsLoggedIn(true); // Set login state to true
    window.localStorage.setItem('loggedUser', JSON.stringify(user)); // Store user in localStorage
  };

  const handleLogout = () => {
    setCurrentUser(null); // Clear the current user
    setIsLoggedIn(false); // Reset the login state
    window.localStorage.removeItem('loggedUser'); // Remove user from localStorage
    setSelectedChatId(null); // Reset selected chat
    setMessages(null); // Reset messages
  };

  const handleSelectChat = (chatId: string, chatMessages: Message[]) => {
    setSelectedChatId(chatId); // Set the selected chat ID
    setMessages(chatMessages); // Set the messages for the selected chat
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} onSignUp={handleSignUp} />} />
        </Routes>
      ) : (
        <>
          <Navbar onLogout={handleLogout} username={currentUser?.username || ''} />
          <div className="flex flex-col">
            <Routes>
              <Route
                path="/messages"
                element={
                  <div className="flex h-screen">
                    {/* Pass currentUser.id to MessageSidebar */}
                    <MessageSidebar
                      userId={currentUser?.id || ''}
                      onSelectChat={handleSelectChat}
                    />
                    <ChatWindow
                      chatId={selectedChatId}
                      messages={messages}
                      currentUser={currentUser}
                    />
                  </div>
                }
              />
              <Route path="/friends" element={<Friends />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/report" element={<Report />} />
              <Route path="*" element={<Navigate to="/messages" />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
};

export default App;