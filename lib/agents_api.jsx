import axios from "axios";
import Cookies from 'js-cookie';

const agentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Accept": "application/json",
    "x-api-key": "RENT_IT_ONLINE",
  },
});

// Add interceptor to always attach fresh auth token
agentApi.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// CSRF protection
export const csrf = async () => {
  try {
    return await agentApi.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};



export default agentApi;
