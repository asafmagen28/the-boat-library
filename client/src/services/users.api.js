import { useMutation, useQuery } from '@tanstack/react-query';
import api, { QUERY_KEYS } from './api';

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
