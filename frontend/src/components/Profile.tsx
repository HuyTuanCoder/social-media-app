import React, { useState } from 'react';

const Profile = (): JSX.Element => {
  const [user, setUser] = useState({ name: 'User A', email: 'A@gmail.com' });

  const handleUpdate = () => {
    if (window.confirm('Are you sure you want to update your profile?')) {
      // Simulate update logic
      console.log('Profile updated!');
      alert('Your profile has been updated.');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      // Simulate delete logic
      console.log('Profile deleted!');
      alert('Your profile has been deleted.');
    }
  };

  return (
    <div className="p-6 h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="mb-4">
          <p className="text-lg font-semibold">Name:</p>
          <p className="text-gray-700">{user.name}</p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">Email:</p>
          <p className="text-gray-700">{user.email}</p>
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