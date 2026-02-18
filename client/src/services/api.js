import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

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

// Authors
export const useAuthors = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.authors,
    queryFn: () => api.get('/authors').then((res) => res.data),
    ...options,
  });
};

export const useAddAuthor = (options = {}) => {
  return useMutation({
    mutationFn: (data) => api.post('/authors', data),
    ...options,
  });
};

export const useDeleteAuthor = (options = {}) => {
  return useMutation({
    mutationFn: (id) => api.delete(`/authors/${id}`),
    ...options,
  });
};

// Books
export const useBooks = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.books,
    queryFn: () => api.get('/books').then((res) => res.data),
    ...options,
  });
};

export const useAddBook = (options = {}) => {
  return useMutation({
    mutationFn: (data) => api.post('/books', data),
    ...options,
  });
};

export const useDeleteBook = (options = {}) => {
  return useMutation({
    mutationFn: (id) => api.delete(`/books/${id}`),
    ...options,
  });
};

// Loans
export const useAllLoans = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.loans,
    queryFn: () => api.get('/loans').then((res) => res.data),
    ...options,
  });
};

export const useMyLoans = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.myLoans,
    queryFn: () => api.get('/loans/my').then((res) => res.data),
    ...options,
  });
};

export const useBorrowBook = (options = {}) => {
  return useMutation({
    mutationFn: (data) => api.post('/loans', data),
    ...options,
  });
};

export const useReturnLoan = (options = {}) => {
  return useMutation({
    mutationFn: (id) => api.patch(`/loans/${id}/return`),
    ...options,
  });
};

// Users
export const useCustomers = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.customers,
    queryFn: () => api.get('/users').then((res) => res.data),
    ...options,
  });
};

export const useDeleteUser = (options = {}) => {
  return useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    ...options,
  });
};

export default api;
