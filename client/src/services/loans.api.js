import { useMutation, useQuery } from '@tanstack/react-query';
import api, { QUERY_KEYS } from './api';

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
