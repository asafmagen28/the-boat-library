import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { QUERY_KEYS, invalidateQueries } from './cacheUtils';

export const useCustomers = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.customers,
    queryFn: () => api.get('/users').then((res) => res.data),
    ...options,
  });
};

export const useDeleteUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/users/${userId}`);
      return userId;
    },

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.customers });

      const previousCustomers = queryClient.getQueryData(QUERY_KEYS.customers);

      queryClient.setQueryData(QUERY_KEYS.customers, old =>
        old?.filter(customer => customer.id !== userId) || []
      );

      return { previousCustomers };
    },

    onSuccess: (data, userId, context) => {
      invalidateQueries(queryClient, [QUERY_KEYS.customers]);

      // Call component's onSuccess if provided
      options.onSuccess?.(data, userId, context);
    },

    onError: (error, userId, context) => {
      if (context?.previousCustomers) {
        queryClient.setQueryData(QUERY_KEYS.customers, context.previousCustomers);
      }

      // Call component's onError if provided
      options.onError?.(error, userId, context);
    },

    ...options
  });
};
