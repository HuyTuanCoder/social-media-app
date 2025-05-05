import React, { useState } from 'react';
import friendService from '../services/friendService'; // Import the friend service

// Sample data for demonstration
const sampleUsers = [
  { id: 1, name: 'User A', isFriend: false },
  { id: 2, name: 'User B', isFriend: true },
  { id: 3, name: 'User C', isFriend: false },
];

const sampleFriends = [
  { id: 1, name: 'User D', friendshipDate: '2023-01-01' },
  { id: 2, name: 'User E', friendshipDate: '2023-02-15' },
];

const Friends = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState(sampleUsers); // State for search results
  const [friends, setFriends] = useState(sampleFriends); // State for current friends

  // Handle search input change
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    // Simulate API call to search users
    const results = sampleUsers.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  // Handle adding a friend
  const handleAddFriend = async (userId: number) => {
    try {
      // Simulate API call to add a friend
      const newFriend = searchResults.find((user) => user.id === userId);
      if (newFriend) {
        setFriends([...friends, { id: newFriend.id, name: newFriend.name, friendshipDate: new Date().toISOString().split('T')[0] }]);
        setSearchResults(
          searchResults.map((user) =>
            user.id === userId ? { ...user, isFriend: true } : user
          )
        );
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  // Handle deleting a friend
  const handleDeleteFriend = async (userId: number) => {
    try {
      // Simulate API call to delete a friend
      setFriends(friends.filter((friend) => friend.id !== userId));
      setSearchResults(
        searchResults.map((user) =>
          user.id === userId ? { ...user, isFriend: false } : user
        )
      );
    } catch (error) {
      console.error('Error deleting friend:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Search and Add/Delete Friends */}
      <div className="w-1/2 h-full p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Find Friends</h2>
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <ul>
          {searchResults.map((user) => (
            <li
              key={user.id}
              className="p-2 mb-2 bg-white rounded shadow flex justify-between items-center"
            >
              <span>{user.name}</span>
              {user.isFriend ? (
                <button
                  onClick={() => handleDeleteFriend(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={() => handleAddFriend(user.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side: Current Friends */}
      <div className="w-1/2 h-full p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          Your Friends ({friends.length})
        </h2>
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="p-2 mb-2 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p>{friend.name}</p>
                <p className="text-sm text-gray-500">
                  Friends since: {friend.friendshipDate}
                </p>
              </div>
              <button
                onClick={() => handleDeleteFriend(friend.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Friends;