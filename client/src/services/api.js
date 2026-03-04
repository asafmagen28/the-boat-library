import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const serverError = responseData?.error;
    const serverMessage = responseData?.message;
    const fallbackMessage = error.code === 'ERR_NETWORK' ? 'Network Error' : 'Something went wrong';

    const message =
      (typeof serverError === 'string' && serverError.trim()) ||
      (typeof serverMessage === 'string' && serverMessage.trim()) ||
      fallbackMessage;

    const normalizedError = new Error(message);
    normalizedError.status = status;
    normalizedError.code = error.code;
    normalizedError.data = responseData;
    normalizedError.isNetworkError = !error.response;
    normalizedError.originalError = error;

    return Promise.reject(normalizedError);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, password, employeeCode) =>
    api.post('/auth/register', { username, password, employeeCode }),
};

export const useGenerateCode = () => {
  return useMutation({
      mutationFn: () => api.post('/employee-codes'),
  })
};

export const useLogin = (options = {}) => {
  return useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    ...options,
  })
};

export const useRegister = (options = {}) => {
  return useMutation({
    mutationFn: (data) => api.post('/auth/register', data),
    ...options,
  })
};

export default api;
