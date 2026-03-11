import { keepPreviousData } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { QUERY_KEYS, invalidateQueries } from './cacheUtils';
import { PAGINATION } from '../constants/api';

export const useCustomers = ({ page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, search = "", sortBy = "username", sortOrder = "ASC" } = {}, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.customers, { page, limit, search, sortBy, sortOrder }],
    queryFn: () => api.get('/users', { params: { page, limit, search, sortBy, sortOrder } }).then((res) => res.data),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useMyBudget = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.myBudget,
    queryFn: () => api.get('/users/me/budget').then((res) => res.data),
    ...options,
  });
};

export const useMyTransactions = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.myTransactions,
    queryFn: () => api.get('/users/me/transactions').then((res) => res.data),
    ...options,
  });
};

export const useAddBalance = ({ onSuccess, onError, ...rest } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, amount }) => api.patch(`/users/${userId}/balance`, { amount }),
    onSuccess: (data, variables, context) => {
      invalidateQueries(queryClient, [QUERY_KEYS.customers]);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
    ...rest,
  });
};

export const useDeleteUser = ({ onSuccess, onError, onMutate, ...restOptions } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/users/${userId}`);
      return userId;
    },

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.customers });

      const previousCustomersList = queryClient.getQueriesData({ queryKey: QUERY_KEYS.customers });

      queryClient.setQueriesData({ queryKey: QUERY_KEYS.customers }, old => {
        if (!old || !old.customers) return old;
        return {
          ...old,
          customers: old.customers.filter(customer => customer.id !== userId)
        };
      });

      return { previousCustomersList };
    },

    onSuccess: (data, userId, context) => {
      invalidateQueries(queryClient, [QUERY_KEYS.customers]);

      // Call component's onSuccess if provided
      onSuccess?.(data, userId, context);
    },

    onError: (error, userId, context) => {
      if (context?.previousCustomersList) {
        context.previousCustomersList.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Call component's onError if provided
      onError?.(error, userId, context);
    },

    ...restOptions
  });
};
