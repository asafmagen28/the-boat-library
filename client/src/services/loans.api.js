import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { QUERY_KEYS, optimisticReturnLoan, optimisticBorrowBook, rollbackOptimisticUpdate, invalidateQueries } from './cacheUtils';

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

export const useBorrowBook = ({ onSuccess, onError, onMutate, ...restOptions } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (borrowData) => {
      const response = await api.post('/loans', borrowData);
      return response.data;
    },

    onMutate: async (borrowData) => {
      const context = await optimisticBorrowBook(queryClient, borrowData);
      return context;
    },

    onSuccess: (data, variables, context) => {
      invalidateQueries(queryClient, [QUERY_KEYS.myLoans, QUERY_KEYS.books]);
      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      rollbackOptimisticUpdate(queryClient, context);
      onError?.(error, variables, context);
    },

    ...restOptions
  });
};

export const useReturnLoan = ({ onSuccess, onError, onMutate, ...restOptions } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanId) => {
      const response = await api.patch(`/loans/${loanId}/return`);
      return response.data;
    },

    onMutate: async (loanId) => {
      const context = await optimisticReturnLoan(queryClient, loanId);
      return context;
    },

    onSuccess: (data, loanId, context) => {
      invalidateQueries(queryClient, [QUERY_KEYS.loans, QUERY_KEYS.books]);
      onSuccess?.(data, loanId, context);
    },

    onError: (error, loanId, context) => {
      rollbackOptimisticUpdate(queryClient, context);
      onError?.(error, loanId, context);
    },

    ...restOptions
  });
};
