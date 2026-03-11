import { keepPreviousData } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { QUERY_KEYS, invalidateQueries } from './cacheUtils';
import { apiLogger } from '../utils/logger';
import { TEMP_ID_PREFIX, PAGINATION } from '../constants/api';

const findAuthorInCache = (queryClient, authorId) => {
  const currentAuthorsList = queryClient.getQueriesData({ queryKey: QUERY_KEYS.authors });
  for (const [, data] of currentAuthorsList) {
    const author = data?.authors?.find(a => a.id === authorId);
    if (author) return author;
  }
  return null;
};

export const useAuthors = ({ page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, search = "", sortBy = "surname", sortOrder = "ASC" } = {}, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.authors, { page, limit, search, sortBy, sortOrder }],
    queryFn: () => api.get('/authors', { params: { page, limit, search, sortBy, sortOrder } }).then((res) => res.data),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useAddAuthor = ({ onSuccess, onError, onSettled, onMutate, ...restOptions } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (authorData) => {
      apiLogger.request('POST', '/authors', authorData);

      try {
        const response = await api.post('/authors', authorData);
        apiLogger.response('POST', '/authors', response);
        return response.data;
      } catch (error) {
        apiLogger.error('POST', '/authors', error);
        throw error;
      }
    },

    // Optimistic update - Add author immediately to cache
    onMutate: async (newAuthor) => {
      apiLogger.optimistic('add author', newAuthor);

      // Cancel outgoing queries to avoid conflicts
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.authors });

      // Get current queries data for rollback
      const previousAuthorsList = queryClient.getQueriesData({ queryKey: QUERY_KEYS.authors });

      // Create unique temporary ID for tracking
      const tempId = `${TEMP_ID_PREFIX}${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // Optimistically update cache with temporary ID
      const optimisticAuthor = {
        ...newAuthor,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true
      };

      queryClient.setQueriesData({ queryKey: QUERY_KEYS.authors }, old => {
        if (!old || !old.authors || old.currentPage !== 1) return old;
        return {
          ...old,
          authors: [optimisticAuthor, ...old.authors]
        };
      });

      return { previousAuthorsList, tempId, optimisticAuthor };
    },

    // Success - Replace optimistic entry with real data
    onSuccess: (savedAuthor, variables, context) => {
      try {
        // Replace the specific optimistic entry with real data
        queryClient.setQueriesData({ queryKey: QUERY_KEYS.authors }, old => {
          if (!old || !old.authors || !context?.tempId) {
            return old;
          }

          return {
            ...old,
            authors: old.authors.map(author => {
              if (author.id === context.tempId) {
                return { ...savedAuthor, isOptimistic: false };
              }
              return author;
            })
          };
        });

        // Call component's onSuccess if provided
        onSuccess?.(savedAuthor, variables, context);

      } catch (error) {
        apiLogger.error('onSuccess callback', '', error);
        throw error;
      }
    },

    // Error - Rollback optimistic update
    onError: (error, variables, context) => {
      apiLogger.rollback('add author', error.message);

      // Revert to previous state using properly captured previousAuthors
      if (context?.previousAuthorsList) {
        context.previousAuthorsList.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Call component's onError if provided
      onError?.(error, variables, context);
    },

    onSettled: (data, error, variables, context) => {
      // Invalidate to ensure fresh data from server
      invalidateQueries(queryClient, [QUERY_KEYS.authors]);

      // Call component's onSettled if provided
      onSettled?.(data, error, variables, context);
    },

    ...restOptions
  });
};

export const useDeleteAuthor = ({ onSuccess, onError, onMutate, ...restOptions } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (authorId) => {
      const author = findAuthorInCache(queryClient, authorId);

      if (author?.isOptimistic) {
        throw new Error('Cannot delete unsaved author. Please wait for it to save first.');
      }

      await api.delete(`/authors/${authorId}`);
      return authorId;
    },

    // Optimistic update - Remove author immediately from cache
    onMutate: async (authorId) => {
      const author = findAuthorInCache(queryClient, authorId);

      if (author?.isOptimistic) {
        // Don't proceed with optimistic update for optimistic entries
        return null;
      }

      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.authors });

      const previousAuthorsList = queryClient.getQueriesData({ queryKey: QUERY_KEYS.authors });

      // Optimistically remove from cache
      queryClient.setQueriesData({ queryKey: QUERY_KEYS.authors }, old => {
        if (!old || !old.authors) return old;
        return {
          ...old,
          authors: old.authors.filter(author => author.id !== authorId)
        };
      });

      return { previousAuthorsList };
    },

    // Success - Confirm deletion
    onSuccess: (data, authorId, context) => {
      // Invalidate to ensure consistent data
      invalidateQueries(queryClient, [QUERY_KEYS.authors]);

      // Call component's onSuccess if provided
      onSuccess?.(data, authorId, context);
    },

    // Error - Rollback optimistic update
    onError: (error, authorId, context) => {
      // Only rollback if we have previous data (i.e., wasn't an optimistic entry)
      if (context?.previousAuthorsList) {
        context.previousAuthorsList.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Call component's onError if provided
      onError?.(error, authorId, context);
    },

    ...restOptions
  });
};
