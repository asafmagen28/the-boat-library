import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from './api';
import { QUERY_KEYS, invalidateQueries } from './cacheUtils';
import { TEMP_ID_PREFIX, PAGINATION } from '../constants/api';

// Helper functions for cache operations
const isFirstPage = (queryKey) => {
  return queryKey[1]?.page === PAGINATION.DEFAULT_PAGE || !queryKey[1]?.page;
};

const updateBookInCache = (data, bookToAdd, isAdd = true) => {
  if (!data || !data.books) return data;

  return {
    ...data,
    books: isAdd ? [bookToAdd, ...data.books] : data.books.filter(book => book.id !== bookToAdd.id),
    totalCount: isAdd ? data.totalCount + 1 : Math.max(0, data.totalCount - 1)
  };
};

const processBookQueries = (queryClient, queryKey, processor) => {
  const queriesData = queryClient.getQueriesData({ queryKey });
  const rollbackData = [];

  queriesData.forEach(([queryKey, data]) => {
    if (data && data.books) {
      rollbackData.push({ queryKey, previousData: data });
      const updatedData = processor(queryKey, data);
      if (updatedData) {
        queryClient.setQueryData(queryKey, updatedData);
      }
    }
  });

  return rollbackData;
};

export const useBooks = ({ page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = {}, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.books, { page, limit }],
    queryFn: () => api.get('/books', { params: { page, limit } }).then((res) => res.data),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useAddBook = ({ onSuccess, onError, onMutate, ...restOptions } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookData) => {
      const response = await api.post('/books', bookData);
      return response.data;
    },

    onMutate: async (newBookData) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.books });

      const tempBook = {
        id: `${TEMP_ID_PREFIX}${Date.now()}`,
        ...newBookData,
        availableCopies: newBookData.numberOfCopies || 0,
        totalCopies: newBookData.numberOfCopies || 0,
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };

      const rollbackData = processBookQueries(queryClient, QUERY_KEYS.books, (queryKey, data) => {
        // Only update first page with new book
        return isFirstPage(queryKey) ? updateBookInCache(data, tempBook, true) : null;
      });

      return { rollbackData, optimisticBook: tempBook };
    },

    onSuccess: (savedBook, variables, context) => {
      // Replace optimistic entry with real data
      processBookQueries(queryClient, QUERY_KEYS.books, (_, data) => ({
        ...data,
        books: data.books
          .filter(book => !book.isOptimistic)
          .concat(savedBook)
      }));

      invalidateQueries(queryClient, [QUERY_KEYS.books]);
      onSuccess?.(savedBook, variables, context);
    },

    onError: (error, variables, context) => {
      // Rollback optimistic updates
      context?.rollbackData?.forEach(({ queryKey, previousData }) => {
        queryClient.setQueryData(queryKey, previousData);
      });

      onError?.(error, variables, context);
    },

    ...restOptions
  });
};

export const useDeleteBook = ({ onSuccess, onError, onMutate, ...restOptions } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId) => {
      await api.delete(`/books/${bookId}`);
      return bookId;
    },

    onMutate: async (bookId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.books });

      const rollbackData = processBookQueries(queryClient, QUERY_KEYS.books, (_, data) => ({
        ...data,
        books: data.books.filter(book => book.id !== bookId),
        totalCount: Math.max(0, data.totalCount - 1)
      }));

      return { rollbackData };
    },

    onSuccess: (data, bookId, context) => {
      invalidateQueries(queryClient, [QUERY_KEYS.books]);

      // Call component's onSuccess if provided
      onSuccess?.(data, bookId, context);
    },

    onError: (error, bookId, context) => {
      // Rollback optimistic updates
      context?.rollbackData?.forEach(({ queryKey, previousData }) => {
        queryClient.setQueryData(queryKey, previousData);
      });

      onError?.(error, bookId, context);
    },

    ...restOptions
  });
};
