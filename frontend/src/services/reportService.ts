import api from './axiosConfig';

const reportService = {
  loadReport: async (userId: string) => {
    const response = await api.get(`/reports/${userId}`);
    return response.data;
  },
};

export default reportService;