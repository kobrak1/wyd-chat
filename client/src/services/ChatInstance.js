import axios from 'axios';
import { LocalStorageManager } from '../utils/LocalStorageManager';

// Create a new Axios instance with custom configuration
let ChatInstance = axios.create({
  baseURL: '/api',
  timeout: 10000, // Request timeout in milliseconds (10 seconds in this example)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle request errors
ChatInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config before it is sent
    const user = LocalStorageManager.getItem('user')

    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle response errors
ChatInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data before it is returned
    return response;
  },
  (error) => {
    // You can also re-throw the error to let the calling code handle it
    return Promise.reject(error);
  }
);

export default ChatInstance;
