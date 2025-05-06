import React, { useState, useEffect } from 'react';
import friendService from '../services/friendService';
import { User } from '../types/types';

interface FriendUser extends User {
  friendshipId?: string;
  friendshipDate?: string;
  isFriend?: boolean;
}

const Friends = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get current user from localStorage
  const getCurrentUserId = (): string => {
    const userJSON = localStorage.getItem('loggedUser');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      return user.id;
    }
    return '';
  };

  const userId = getCurrentUserId();

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch all friends on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) return;
      
      try {
        const response = await friendService.getAllFriends(userId);
        
        // Format the friendship date
        const formattedFriends = response.map((friend: FriendUser) => ({
          ...friend,
          friendshipDate: friend.friendshipDate ? formatDate(friend.friendshipDate) : 'Unknown'
        }));
        
        setFriends(formattedFriends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [userId]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
  
    try {
      // Fetch search results from the backend
      const results = await friendService.findFriend(searchQuery);
      
      // Filter out the current user and enhance results to include friendship status
      const enhancedResults = results
        .filter((user: User) => user.id !== userId) // Remove the current user
        .map((user: User) => {
          const existingFriend = friends.find((friend) => friend.id === user.id);
          return {
            ...user,
            isFriend: !!existingFriend, // Check if the user is already a friend
            friendshipId: existingFriend?.friendshipId, // Include friendshipId if they are friends
          };
        });
  
      setSearchResults(enhancedResults);
    } catch (error) {
      console.error('Error searching for friends:', error);
    }
  };

  // Handle adding a friend
  const handleAddFriend = async (friendId: string) => {
    if (!userId) return;
    
    try {
      const response = await friendService.addFriend(userId, friendId);
      
      // Get the friend user from search results
      const addedFriend = searchResults.find(user => user.id === friendId);
      
      if (addedFriend && response.friendship) {
        // Create a new friend object with friendship info
        const newFriend: FriendUser = {
          ...addedFriend,
          friendshipId: response.friendship.id,
          friendshipDate: formatDate(response.friendship.createdAt),
          isFriend: true
        };
        
        // Update friends list
        setFriends(prevFriends => [...prevFriends, newFriend]);
        
        // Update search results to show friendship status
        setSearchResults(prevResults =>
          prevResults.map(user =>
            user.id === friendId
              ? { ...user, isFriend: true, friendshipId: response.friendship.id }
              : user
          )
        );
      }
    } catch (error: any) {
      console.error('Error adding friend:', error);
    }
  };

  // Handle deleting a friend
  const handleDeleteFriend = async (friendshipId: string) => {
    try {
      await friendService.deleteFriend(friendshipId);
      
      // Remove from friends list
      setFriends(prevFriends => 
        prevFriends.filter(friend => friend.friendshipId !== friendshipId)
      );
      
      // Update search results if friend is in search results
      setSearchResults(prevResults =>
        prevResults.map(user =>
          user.friendshipId === friendshipId
            ? { ...user, isFriend: false, friendshipId: undefined }
            : user
        )
      );
    } catch (error: any) {
      console.error('Error deleting friend:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Search and Add/Delete Friends */}
      <div className="w-1/2 h-full p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Find Friends</h2>
        
        {/* Search form with onSubmit event */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search for users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border rounded-l"
            />
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <ul>
          {searchResults.map((user) => (
            <li
              key={user.id}
              className="p-2 mb-2 bg-white rounded shadow flex justify-between items-center"
            >
              <span>{user.username}</span>
              {user.isFriend ? (
                <button
                  onClick={() => handleDeleteFriend(user.friendshipId!)}
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
        {friends.length === 0 && <p className="text-gray-500">You don't have any friends yet</p>}
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="p-2 mb-2 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p>{friend.username}</p>
                <p className="text-sm text-gray-500">
                  Friends since: {friend.friendshipDate}
                </p>
              </div>
              <button
                onClick={() => handleDeleteFriend(friend.friendshipId!)}
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