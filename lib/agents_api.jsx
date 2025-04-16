import axios from "axios";
import Cookies from 'js-cookie';

const agentApi = axios.create({
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

// Get Category Insights
export const getCategoryInsights = async (params = {}) => {
    try {
        await csrf();
        const response = await agentApi.get(`${process.env.NEXT_PUBLIC_API_VERSION}/agents/category-insights`, {
            params,
        });
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

export default agentApi;
