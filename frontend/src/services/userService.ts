import api from './axiosConfig';

const userService = {
  changeUsername: async (userId: string, newUsername: string) => {
    const response = await api.put(`/users/${userId}/username`, { username: newUsername });
    return response.data;
  },

  changeEmail: async (userId: string, newEmail: string) => {
    const response = await api.put(`/users/${userId}/email`, { email: newEmail });
    return response.data;
  },
};

export default userService;