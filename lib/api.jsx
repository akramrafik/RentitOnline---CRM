import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "Accept": "Application/json",
        "x-api-key": "RENT_IT_ONLINE"
    }
});

export const csrf = async () => {
    try {
        await api.get('/sanctum/csrf-cookie');
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

export const login = async (email, password) => {
    try{
        await csrf();
        const response = await api.post(`${process.env.NEXT_PUBLIC_API_VERSION}/auth/login`, {email,password});
        console.log('API Response:', response);
        return response.data;
    }catch (err){
        console.error('Error during login:', err);
        throw err;
    }
};

export const getUser = async () => {
    return api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/api/user`);
};

export const logout = async () => {
    return api.post(`${process.env.NEXT_PUBLIC_API_VERSION}/auth/logout`);
};

// dashboard fetch
export const getDashboardData = async () => {
    try {
      await csrf();
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/dashboard`, {data});
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      throw error;
    }
  };
  

export default api;