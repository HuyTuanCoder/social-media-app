
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import MessageSidebar from './components/MessageSidebar';
import ChatWindow from './components/ChatWindow';
import Friends from './components/Friends';
import Profile from './components/Profile';
import Report from './components/Report';
import { User, Message } from './types/types';

const App = (): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    window.localStorage.setItem('loggedUser', JSON.stringify(user));
  };

  const handleSignUp = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    window.localStorage.setItem('loggedUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    window.localStorage.removeItem('loggedUser');
    setSelectedChatId(null);
    setMessages(null);
  };

  const handleSelectChat = (chatId: string, chatMessages: Message[], otherUser: User) => {
    setOtherUser(otherUser);
    setSelectedChatId(chatId);
    setMessages(chatMessages);
  };

  const handleNewMessage = (newMessage: Message) => {
    // Check if the new message belongs to the current chat
    if (newMessage.chatId === selectedChatId) {
      setMessages((prevMessages) => {
        // Make sure we don't add duplicate messages
        if (prevMessages && !prevMessages.some(msg => msg.id === newMessage.id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    }
  };

  const handleUserDeleted = () => {
    // Reset all states
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSelectedChatId(null);
    setMessages(null);
    setOtherUser(null);

    // Clear localStorage
    window.localStorage.removeItem('loggedUser');

    // Redirect to login page using React Router's useNavigate
    const navigate = useNavigate();
    navigate('/');
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
                    <MessageSidebar
                      userId={currentUser?.id || ''}
                      onSelectChat={handleSelectChat}
                    />
                    <ChatWindow
                      chatId={selectedChatId}
                      messages={messages}
                      currentUser={currentUser}
                      onNewMessage={handleNewMessage}
                      otherUser={otherUser}
                    />
                  </div>
                }
              />
              <Route path="/friends" element={<Friends />} />
              <Route
                path="/profile"
                element={
                  currentUser ? (
                    <Profile user={currentUser} onUserDeleted={handleUserDeleted} />
                  ) : (
                    <Navigate to="/messages" />
                  )
                }
              />
              <Route
                path="/report"
                element={
                  currentUser ? (
                    <Report userId={currentUser.id} />
                  ) : (
                    <Navigate to="/messages" />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/messages" />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
};

export default App;