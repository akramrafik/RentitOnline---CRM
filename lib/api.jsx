import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Accept": "Application/json",
        "x-api-key": "RENT_IT_ONLINE",
        "Authorization": "Bearer " + Cookies.get('auth_token')
    }
});


api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


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
        if(response?.data?.data?.token){
            Cookies.set('auth_token', response?.data?.data?.token)
        }
        
        console.log('API Response:', response);
        return response.data;
    }catch (err){
        console.error('Error during login:', err);
        throw err;
    }
};

export const getUser = async () => {
    return await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/user/profile`);
};

export const logout = async () => {
    Cookies.remove('auth_token')
    return api.post(`${process.env.NEXT_PUBLIC_API_VERSION}/auth/logout`);
};

// dashboard fetch
export const getDashboardData = async () => {
    try {
      await csrf(); // Assuming this is a CSRF token setup function
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/dashboard`);
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
//   get monthly monthly-ads-report
export const getMonthlyAdsReport = async () => {
    try{
        await csrf();
        const response = await api.post(`${process.env.NEXT_PUBLIC_API_VERSION}/monthly-ads-report`);
        return response.data;
    } catch (error){
        console.error('Error fetching monthly ads report:', error);
     }
};
//   mobile otp
export const GetmobileOtp = async() => {
    try{
        await csrf();
        const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/customers/mobile-otp`);
        return response.data;
    }catch (err){
        console.error('Error during mobile otp:', err);
        if(err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        }
        throw err;
    }
};

export default api;
