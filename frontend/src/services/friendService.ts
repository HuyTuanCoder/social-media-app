import api from './axiosConfig';

const friendService = {
  addFriend: async (userId: string, friendId: string) => {
    const response = await api.post(`friendship/befriend`, {
      userAId: userId,
      userBId: friendId
    });
    return response.data;
  },

  findFriend: async (query: string) => {
    const response = await api.get(`user/search`, { params: { query } }); // Ensure query is passed correctly
    return response.data;
  },

  deleteFriend: async (friendshipId: string) => {
    const response = await api.delete(`friendship/${friendshipId}`);
    return response.data;
  },

  getAllFriends: async (userId: string) => {
    const response = await api.get(`friendship/${userId}`);
    return response.data;
  },
};

export default friendService;