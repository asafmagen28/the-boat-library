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
