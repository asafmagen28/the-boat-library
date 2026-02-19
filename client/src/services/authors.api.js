import { useMutation, useQuery } from '@tanstack/react-query';
import api, { QUERY_KEYS } from './api';

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
