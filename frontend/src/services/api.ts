/// <reference types="vite/client" />
import axios from 'axios';

const getDynamicApiUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const hostname = typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : 'localhost';
  return `http://${hostname}:8000`;
};

const API_BASE_URL = getDynamicApiUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medikiosk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standard error formatting
    let message = 'An unexpected error occurred.';
    if (error.response) {
      if (error.response.data && error.response.data.detail) {
        if (typeof error.response.data.detail === 'string') {
          message = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          message = error.response.data.detail.map((err: any) => err.msg).join(', ');
        }
      } else {
        message = `HTTP ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      message = 'Unable to connect to MediKiosk backend server. Please verify backend is running on port 8000.';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
