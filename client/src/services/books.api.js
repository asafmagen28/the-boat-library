import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query';
import api, { QUERY_KEYS } from './api';

export const useBooks = ({ page = 1, limit = 10 } = {}, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.books, { page, limit }],
    queryFn: () => api.get('/books', { params: { page, limit } }).then((res) => res.data),
    placeholderData: keepPreviousData,
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
