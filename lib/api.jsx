import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_URL,   
    withCredentials: true, // Important for cookies
});

export const csrf = async () => {
    await api.get('/sanctum/csrf-cookie');
};

export const login = async (email, password) => {
    await csrf();
    return api.post('/api/login', { email, password });
};

export const getUser = async () => {
    return api.get('/api/user');
};

export const logout = async () => {
    return api.post('/api/logout');
};

export default api;