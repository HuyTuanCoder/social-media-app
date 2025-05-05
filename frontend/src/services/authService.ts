import api from './axiosConfig';

const authService = {
  login: async (identifier: string) => {
    const response = await api.post('user/login', { identifier });
    return response.data;
  },
  
  signUp: async (username: string, email: string) => {
    const response = await api.post('user/create', { username, email });
    return response.data;
  }
};

export default authService;