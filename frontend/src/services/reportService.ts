import api from './axiosConfig';

const reportService = {
  loadReport: async (userId: string, filter: string) => {
    const response = await api.get(`/reports/${userId}`, { params: { filter } });
    return response.data;
  },
};

export default reportService;