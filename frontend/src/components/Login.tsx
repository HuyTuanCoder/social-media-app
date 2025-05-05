import React, { useState } from 'react';
import authService from '../services/authService';
import { User } from '../types/types';

export interface LoginProps {
  onLogin: (user: User) => void;
  onSignUp: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignUp }) => {
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(identifier);
      onLogin(response);
      setError('');
      setSuccess('Successfully signed in!');
    } catch (err) {
      console.log(err);
      setError('Invalid username or email');
      setSuccess('');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.signUp(username, email);
      onSignUp(response);
      setError('');
      setSuccess('Successfully signed up!');
    } catch (err) {
      console.log(err);
      setError('Sign up failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sign In Section */}
      <div className="w-1/2 bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h1 className="text-xl font-bold text-center mb-4">Sign In</h1>
          <form onSubmit={handleSignIn}>
            <input
              type="text"
              placeholder="Enter username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="w-1/2 bg-orange-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h1 className="text-xl font-bold text-center mb-4">Sign Up</h1>
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              Sign Up
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;