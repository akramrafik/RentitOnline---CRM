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

// Get Category Insights
export const getCategoryInsights = async (params = {}) => {
  try {
    await csrf();
    const response = await agentApi.get(`${process.env.NEXT_PUBLIC_API_VERSION}/agents/category-insights`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching category insights:', error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
};

// Get Comparison Data
export const getInsightComparison = async (params = {}) => {
  try {
    await csrf();
    const response = await agentApi.get(`${process.env.NEXT_PUBLIC_API_VERSION}/agents/category-insights/comparison`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching insight comparison:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
};

export default agentApi;
