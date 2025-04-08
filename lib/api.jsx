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


api.interceptors.response.use(function(res){
    if(res.status == 401){
        Cookies.remove('auth_token');
        window.location.reload()
    }

})

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
// export const getDashboardData = async () => {
//     try {
//       await csrf();
//       const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/dashboard`, {data});
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       if (error.response) {
//         console.error("Status:", error.response.status);
//         console.error("Data:", error.response.data);
//       }
//       throw error;
//     }
//   };
  

export default api;