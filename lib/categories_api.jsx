import axios from "axios";
import Cookies from 'js-cookie';

const CategoriesApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Accept": "application/json", // fixed casing
        "x-api-key": "RENT_IT_ONLINE",
        "Authorization": "Bearer " + (Cookies.get('auth_token') || '')
    }
});

// Get CSRF token
export const csrf = async () => {
    try {
        await agentApi.get('/sanctum/csrf-cookie');
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

// Get Category 
export const getCategories = async (params = {}) => {
    
}

export default CategoriesApi;
