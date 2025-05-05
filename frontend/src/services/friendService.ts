import api from './axiosConfig';

const friendService = {
  addFriend: async (userId: string, friendId: string) => {
    const response = await api.post(`/friends`, { userId, friendId });
    return response.data;
  },

  findFriend: async (query: string) => {
    const response = await api.get(`/friends/search`, { params: { query } });
    return response.data;
  },

  deleteFriend: async (friendshipId: string) => {
    const response = await api.delete(`/friends/${friendshipId}`);
    return response.data;
  },
};

export default friendService;