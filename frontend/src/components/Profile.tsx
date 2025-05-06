import React, { useState } from 'react';
import userService from '../services/userService';
import { User } from '../types/types';

interface ProfileProps {
  user: User; // User object passed from App.tsx
  onUserDeleted: () => void; // Callback to handle user deletion
}

const Profile: React.FC<ProfileProps> = ({ user, onUserDeleted }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async () => {
    if (window.confirm('Are you sure you want to update your profile?')) {
      try {
        // Update username and email via API
        const updates: { username?: string; email?: string } = {};
        if (username !== user.username) updates.username = username;
        if (email !== user.email) updates.email = email;

        if (Object.keys(updates).length > 0) {
          await userService.updateUser(user.id, updates); // Matches `/update/:id`
          alert('Your profile has been updated.');
        } else {
          alert('No changes were made.');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        // Delete user via API
        await userService.deleteUser(user.id); // Matches `/delete/:id`
        alert('Your profile has been deleted.');
        onUserDeleted(); // Notify parent component about user deletion
      } catch (error) {
        console.error('Error deleting profile:', error);
        alert('Failed to delete profile. Please try again.');
      }
    }
  };

  return (
    <div className="p-6 h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="mb-4">
          <label className="text-lg font-semibold">Name:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;