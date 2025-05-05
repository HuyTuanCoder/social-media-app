import api from './axiosConfig';

const messageService = {
  // Fetch all chat relationships for a user
  getUserChats: async (userId: string) => {
    const response = await api.get('chat/user-chats', {
      params: { userId },
    });
    return response.data;
  },

  // Send a message
  sendMessage: async (senderId: string, receiverId: string, text: string) => {
    const response = await api.post('chat/create', { senderId, receiverId, text });
    return response.data;
  },

  // Get all messages between two users
  getChatMessages: async (userAId: string, userBId: string) => {
    const response = await api.get('chat/messages', {
      params: { userAId, userBId },
    });
    return response.data;
  },

  // Delete a specific message
  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`chat/delete/${messageId}`);
    return response.data;
  },
};

export default messageService;