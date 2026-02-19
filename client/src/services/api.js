import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export const QUERY_KEYS = {
  books: ['books'],
  authors: ['authors'],
  loans: ['loans'],
  myLoans: ['myLoans'],
  customers: ['customers'],
};

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
    const message = error.response?.data?.error || 'Something went wrong';
    return Promise.reject(new Error(message));
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
