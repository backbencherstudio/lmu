import { CookieHelper } from "../helper/cookie.helper";
import axios from "axios";

const API_URL = 'https://backend.caymanbizevents.com';

// Get base URL without /api for image URLs
const getBaseUrl = () => {
  return API_URL;
};

// Maximum number of retries for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 30000,
});

// Add request retry logic
const retryRequest = async (error) => {
  const config = error.config;
  
  // Only retry on network errors or 5xx server errors
  if (!config || !error.response || error.response.status < 500) {
    return Promise.reject(error);
  }

  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= MAX_RETRIES) {
    return Promise.reject(error);
  }

  config.__retryCount += 1;

  // Delay before retrying
  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  
  return axiosClient(config);
};

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = CookieHelper.get({ key: "token" });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Response:', response.data);
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject({
        success: false,
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status
      });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        success: false,
        message: 'No response from server. Please check your internet connection.',
        status: 0
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({
        success: false,
        message: error.message || 'An error occurred',
        status: 0
      });
    }
  }
);

export { getBaseUrl };
export default axiosClient;
