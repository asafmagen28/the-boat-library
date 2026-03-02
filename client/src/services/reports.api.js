import { useQuery } from '@tanstack/react-query';
import api from './api';
import { QUERY_KEYS } from './cacheUtils';

export const useBestSellers = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.bestSellers,
    queryFn: () => api.get('/reports/best-sellers').then((res) => res.data),
    ...options,
  });
};

export const useAuthorPayments = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.authorPayments,
    queryFn: () => api.get('/reports/author-payments').then((res) => res.data),
    ...options,
  });
};
