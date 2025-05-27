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
    let res = api.post(`${process.env.NEXT_PUBLIC_API_VERSION}/auth/logout`);
    Cookies.remove('auth_token')
    return res;
};

// dashboard fetch
export const getDashboardData = async () => {
    try {
      await csrf(); // Assuming this is a CSRF token setup function
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/dashboard`);
    //   console.log('Actual API response:', response.data);
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
export const getMonthlyAdsReport = async (params = {}) => {
    try{
        await csrf();
        const response = await api.post(`${process.env.NEXT_PUBLIC_API_VERSION}/dashboard/monthly-ads-report`, params);
        return response.data;
    } catch (error){
        console.error('Error fetching monthly ads report:', error);
        throw error;   
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
// email otp
export const GetEmailOtp = async() =>{
    try{
        await csrf();
        const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/customers/email-otp`);
        return response.data;
    }catch (err){
        console.error('Error during email otp:', err);
        if(err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        }
        throw err;
    }
};

// Get Category Insights
export const getCategoryInsights = async (params = {}) => {
    try {
      await csrf();
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/agents/category-insights`, { params });
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
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/agents/category-insights/comparison`, { params });
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

//   location search
export const locationSearch = async (locparams = {}) => {
    try {
      await csrf();
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_VERSION}/agents/location-search`,
        { ...locparams }
      );
      return response.data;
    } catch (error) {
      console.error('error fetching location:', error);
      console.log("location API Params:", locparams);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      throw error;
    }
  };

  //get leads
export const getLeads = async (params = {}) => {
  try {
    await csrf();
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/leads?${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};
//get category
export const getCategories = async (params = {}) => {
    try {
      await csrf();
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/categories?${query}`);
      return response.data;
      console.log('Actual API response:', response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  };
  
  // update category status
  export const updateCategoryStatus = async (categoryId) => {
  try {
    await csrf(); // if you require CSRF before the call
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/toggle-status/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category status:", error);
    throw error;
  }
};

// categiry create
export const createCategory = async (params = {}) => {
    try {
      await csrf();
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_VERSION}/categories/create`,
        params
      );
      console.log('Actual API response create category:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  // get plan 
  export const getPlan = async() => {
    try{
      await csrf();
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_VERSION}/plans`,
      );
      console.log('response from plan', response.data);
      return response.data;
    }catch(error){
      console.error('error fetching plans', error);
      throw error;
    }
  };
  // get packages
  export const getPlanPackages = async (planId, params = {}) => {
  try {
    await csrf();
    const query = new URLSearchParams(params).toString();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/plans/${planId}/packages?${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
};

  // toggle plan status
  export const updatePlanStatus = async (planId) => {
  try {
    await csrf(); // if you require CSRF before the call
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/plans/toggle-status/${planId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category status:", error);
    throw error;
  }
};
 // plan delete 
  export const deletePlan = async (planId) => {
  try {
    await csrf(); // if you require CSRF before the call
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/plans/delete/${planId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting plan:", error);
    throw error;
  }
};

 // plan delete 
 export const updatePlan = async (planId, planData) => {
  try {
    await csrf(); 
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_API_VERSION}/plans/update/${planId}`,
      planData
    );
    return response.data;
  } catch (error) {
    console.error("Error in updating plan:", error);
    throw error;
  }
};
// package delete
export const deletePackage = async (package_id) => {
  try{
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/packages/delete/${package_id}`
    );
    return response.data;
  }catch(error){
    console.log('Error deleting package', error);
    throw error;
  }
}
// get package details


export default api;
