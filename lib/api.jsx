import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Accept": "Application/json",
        "x-api-key": "RENT_IT_ONLINE",
        "Authorization": "Bearer " + Cookies.get('auth_token'),
        "x-app-identifier": "ae.rentitonline.app"
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


let csrfTokenFetched = false;
let csrfInProgress = false;
let csrfCallCount = 0;

export const csrf = async () => {
  csrfCallCount++;
  console.log(`CSRF called ${csrfCallCount} time(s)`);
  if (csrfTokenFetched || csrfInProgress) return;

  csrfInProgress = true;
  let timerStarted = false;

  try {
    console.time("CSRF Time");
    timerStarted = true;

    await api.get('/sanctum/csrf-cookie');
    csrfTokenFetched = true;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  } finally {
    if (timerStarted) {
      console.timeEnd("CSRF Time");
    }
    csrfInProgress = false;
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
// get notifications
export const getNotifications = async (queryParams = {}) => {
  try{
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/user/notifications`,{params: queryParams,});
    return response.data;
  }catch (error){
    console.error("error getting notifications:", error);
    throw error;
  }
}
//get notification count 
export const getUnreadNotificationCount = async () => {
  try{
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/user/get-un-notifications-count`);
    return response.data;
  }catch (error){
    console.error("error getting notifications:", error);
    throw error;
  }
}
// dashboard fetch
export const getDashboardData = async () => {
    try {
      await csrf(); 
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
 // delete category status
export const deleteCategory = async (categoryId) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/delete/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting category:", error);
    throw error;
  }
};

// category create
export const createCategory = async (formData) => {
    try {
      await csrf();
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_VERSION}/categories/create`,
        formData
      );
      console.log('Actual API response create category:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  // get specification according to catgeory id
 export const getSpecificationGroupById = async (category_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${category_id}/specification-groups`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch specification groups:", error);
    throw error;
  }
};

 //  deleteSpecificationGroup 
export const deleteSpecificationGroup = async (category_id, group_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${category_id}/specification-groups/delete/${group_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting category:", error);
    throw error;
  }
};
//  status chnage SpecificationGroup 
export const changeSpecificationGroupStatus = async (category_id, group_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${category_id}/specification-groups/toggle-status/${group_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting category:", error);
    throw error;
  }
};

// show SpecificationGroup 
export const showSpecificationGroup = async (category_id, group_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${category_id}/specification-groups/${group_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting category:", error);
    throw error;
  }
};
// update  SpecificationGroup
export const updateSpecificationGroup = async (category_id, group_id, payload) => {
  try {
    await csrf();
    const response = await api.put(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${category_id}/specification-groups/update/${group_id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting category:", error);
    throw error;
  }
};

// createSpecificationGroup
export const createSpecificationGroup = async (category_id, payload) => {
  try{
 await csrf();
  const response = await api.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${category_id}/specification-groups/create`,
    payload
  );
  return response.data;
  }catch (error){
    console.error("Error in create SpecificationGroup:", error);
     throw error;
  }
};

 // get specification by group id
 export const getAllSpecification = async (group_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${group_id}/specifications`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch specificatios:", error);
    throw error;
  }
};

// show SpecificationGroup 
export const showSingleSpec = async (group_id, spec_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${group_id}/specifications/${spec_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting SingleSpec:", error);
    throw error;
  }
};

// createSpecificationGroup
export const createSpecification = async (group_id, payload) => {
  try{
 await csrf();
  const response = await api.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${group_id}/specifications/create`,
    payload
  );
  return response.data;
  }catch (error){
    console.error("Error in create specification:", error);
     throw error;
  }
};
//  status chnage SpecificationStatus 
export const changeSpecificationStatus = async (group_id, spec_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${group_id}/specifications/toggle-status/${spec_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in changing status", error);
    throw error;
  }
};
//  delete Specification
export const deleteSpecification = async (group_id, spec_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/categories/${group_id}/specifications/delete/${spec_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in changing status", error);
    throw error;
  }
};
 // get spec values
 export const getAllSpecValues = async (spec_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/specifications/${spec_id}/values`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch specificatios:", error);
    throw error;
  }
};
// showsingleValue
export const showSingleSpecificationValue = async (spec_id, value_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/specifications/${spec_id}/values/${value_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting single spec value:", error);
    throw error;
  }
};

// update  SpecificationGroup
export const updateSpecificationValue = async (spec_id, valueId, payload) => {
  try {
    await csrf();
    const response = await api.put(
      `${process.env.NEXT_PUBLIC_API_VERSION}/specifications/${spec_id}/values/update/${valueId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error in creating values", error);
    throw error;X
  }
};

//  delete Specification
export const deleteSpecificationValue = async (spec_id, valueId,) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/specifications/${spec_id}/values/delete/${valueId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting value", error);
    throw error;
  }
};
// createSpecificationGroup
export const createSpecificationValue = async (spec_id, payload) => {
  try{
 await csrf();
  const response = await api.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/specifications/${spec_id}/values/create`,
    payload
  );
  return response.data;
  }catch (error){
    console.error("Error in create specification:", error);
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

// get all banner types
export const getAllBannerTypes = async () => {
  try{
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/banner-types`);
    return response.data;
  }catch(error){
    console.error('error getiing banner types', error)
    throw error;
  }
}

// get all blogs 
export const getAllBlogs = async (params = {}) => {
  try{
    await csrf();
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/blogs?${query}`);
    return response.data;
  }catch(error){
    console.error('error getiing blogs', error)
    throw error;
  }
}
// get all blogs 
export const getBlogById = async ({ blog_id }) => {
  try {
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/blogs/show/${blog_id}`);
    return response;
  } catch (error) {
    console.error('Error getting blog by ID:', error);
    throw error;
  }
};

  // update blog status
  export const updateBlogStatus = async (blogId) => {
  try {
    await csrf(); // if you require CSRF before the call
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/blogs/toggle-status/${blogId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category status:", error);
    throw error;
  }
};
// delete blog
export const deleteBlog = async (planId) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/blogs/delete/${planId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting plan:", error);
    throw error;
  }
};
// ads api
export const getAds = async (adId = '', query = {}) => {
  try {
    await csrf();
    const url = adId
      ? `${process.env.NEXT_PUBLIC_API_VERSION}/ads/${adId}`
      : `${process.env.NEXT_PUBLIC_API_VERSION}/ads`;

    const response = await api.get(url, { params: query });
    return response.data;
  } catch (error) {
    console.error("Error getting ads", error);
    throw error;
  }
};
// adstatus change
 export const updateAdStatus = async (adId,status) => {
  try {
    await csrf(); // if you require CSRF before the call
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_API_VERSION}/ads/change-status/${adId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};
// ad delete
export const deleteAd = async (ad_id) => {
  try {
    await csrf();
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/ads/delete/${ad_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting ad:", error);
    throw error;
  }
};
//get ad by id
 export const getAdById = async ({ ad_id }) => {
  try {
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/ads/${ad_id}`);
    return response;
  } catch (error) {
    console.error('Error getting ad by ID:', error);
    throw error;
  }
};
// change ad status
export const changeAdStatus = async ({ ad_id, status, reason }) => {
  try {
    await csrf();

    const formData = new FormData();
    formData.append('status', status);
    if (reason) formData.append('reason', reason);

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_API_VERSION}/ads/change-status/${ad_id}`,
      formData
    );

    return response;
  } catch (error) {
    console.error('Error changing status:', error);
    throw error;
  }
};

// plan mapping
export const mapPlan = async ({ ad_id, plan_id, duration }) => {
  try {
    await csrf();
    const formData = new FormData();
    formData.append('plan_id', plan_id);
    formData.append('duration', duration);

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_API_VERSION}/ads/map-plan/${ad_id}`,
      formData
    );
    return response;
  } catch (error) {
    console.error('Error map-plan:', error);
    throw error;
  }
};
// call leads
export const callLedasByAd = async (ad_id, page = 1) =>{
  try{
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/ads/call-leads/${ad_id}`,{
      params: {page},
    });
    return response;
  }catch(error){
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      console.log(process.env.NEXT_PUBLIC_API_VERSION)
    } else {
      console.error("Network or config error:", error.message);
    }
    throw error
  }
}
// call leads
export const whatsappLedasByAd = async (ad_id, page = 1) =>{
  try{
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/ads/whatsapp-leads/${ad_id}`,{
      params: {page},
    });
    return response;
  }catch(error){
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      console.log(process.env.NEXT_PUBLIC_API_VERSION)
    } else {
      console.error("Network or config error:", error.message);
    }
    throw error
  }
}
// ad clicks
export const adClicks = async (ad_id, page = 1) =>{
  try{
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/ads/clicks/${ad_id}`,{
      params: {page},
    });
    return response;
  }catch(error){
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      console.log(process.env.NEXT_PUBLIC_API_VERSION)
    } else {
      console.error("Network or config error:", error.message);
    }
    throw error
  }
}

// report emirates
export const reportByEmirte = async() => {
  try{
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/reports/emirate`)
    return response;
  }catch(error){
    console.error('error fetching report', error)
  }
  throw error;
}
// edit ad
 export const editAd = async ({ ad_id }) => {
  try {
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/ads/edit/${ad_id}`);
    return response;
  } catch (error) {
    console.error('Error edit add:', error);
    throw error;
  }
};
//get customers
 export const getCustomersList = async (params = {}) => {
  try {
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/customers`,
       { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting Customers:', error);
    throw error;
  }
};
//edit customers
 export const getCustomersById = async ( customer_id ) => {
  try {
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/customers/${customer_id}`,);
    return response.data;
  } catch (error) {
    console.error('Error getting Customers:', error);
    throw error;
  }
};
//post customer details
 export const  updateCustomer = async ({ customer_id,  formData }) => {
  try {
    await csrf();
    const response = await api.post(`${process.env.NEXT_PUBLIC_API_VERSION}/customers/update/${customer_id}`,
       formData
    );
    return response.data;
  } catch (error) {
    console.error('Error getting Customers:', error);
    throw error;
  }
};
// toggle customer status
  export const updateCustomerStatus = async (customer_id) => {
  try {
    await csrf(); // if you require CSRF before the call
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/customers/toggle-status/${customer_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};
// customer delete 
  export const deleteCustomer = async (customer_id) => {
  try {
    await csrf(); // if you require CSRF before the call
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/customers/delete/${customer_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleting customer:", error);
    throw error;
  }
};
// referral program
 export const getAllReferrals = async (params = {}) => {
  try {
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/referral-campaigns`,
       { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting Customers:', error);
    throw error;
  }
};
// Delete referral program by id
 export const deleteReferralById = async (campaign_id) => {
  try {
    await csrf();
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_VERSION}/referral-campaigns/delete/${campaign_id}`,);
    return response.data;
  } catch (error) {
    console.error('Error getting Customers:', error);
    throw error;
  }
};
// toggle referral status
  export const updateReferralStatus = async (campaign_id) => {
  try {
    await csrf(); // if you require CSRF before the call
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_API_VERSION}/referral-campaigns/toggle-status/${campaign_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating referral status:", error);
    throw error;
  }
};
// create referall program
export const createReferralProgram = async(formData) =>{
  try{
    await csrf();
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_API_VERSION}/referral-campaigns/create`,
      formData
    );
    return response.data;
  }catch(error){
    console.error("error submitting referral", error)
    throw error;
  }
};
// get referral by id
export const getReferralById = async(campaign_id) => {
try{
await csrf();
const response = await api.get(
  `${process.env.NEXT_PUBLIC_API_VERSION}/referral-campaigns/${campaign_id}`,
)
return response.data;
}catch(error){
  console.error("error getting data", error)
}
};
// updateReferralProgram
export const updateReferralProgram = async(campaign_id, data) => {
try{
await csrf();
const response = await api.post(
  `${process.env.NEXT_PUBLIC_API_VERSION}/referral-campaigns/update/${campaign_id}`,
  data
)
return response.data;
}catch(error){
  console.error("error updating data", error)
}
};

//getReferralHistory
export const getReferralHistory = async() => {
try{
await csrf();
const response = await api.get(
  `${process.env.NEXT_PUBLIC_API_VERSION}/referral-history`,)
return response.data;
}catch(error){
  console.error("error getting data", error)
}
};

//getReferrawithdraw ststus
export const getReferralWithdraw = async() => {
try{
await csrf();
const response = await api.get(
  `${process.env.NEXT_PUBLIC_API_VERSION}/referral-withdraw`,)
return response.data;
}catch(error){
  console.error("error getting data", error)
}
};
//update referral status
export const changeWithdrawStatus = async (request_id, status) => {
  try {
    await csrf();
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_API_VERSION}/referral-withdraw/change-status/${request_id}`,
      { status }
    );
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data; 
    }
    console.error("Error updating status:", error);
    throw error; 
  }
};


export default api;
