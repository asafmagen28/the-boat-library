import { useMutation, useQuery } from '@tanstack/react-query';
import api, { QUERY_KEYS } from './api';

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
