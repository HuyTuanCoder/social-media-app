import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json', // application only need to send json so this is sufficient
  },
});

export default api;