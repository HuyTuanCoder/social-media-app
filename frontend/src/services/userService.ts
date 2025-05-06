import api from './axiosConfig';

const userService = {
  updateUser: async (userId: string, updates: { username?: string; email?: string }) => {
    const response = await api.put(`/update/${userId}`, updates); // Matches `/update/:id`
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/delete/${userId}`); // Matches `/delete/:id`
    return response.data;
  },
};

export default userService;