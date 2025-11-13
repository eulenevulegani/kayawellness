import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API client configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('kaya-auth-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('kaya-auth-token');
      localStorage.removeItem('kaya-user');
      window.location.href = '/';
    }
    
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden:', error.response.data);
    }
    
    if (error.response?.status === 429) {
      // Rate limit exceeded
      console.error('Rate limit exceeded. Please try again later.');
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    return message;
  }
  return 'An unexpected error occurred';
}

export default apiClient;
