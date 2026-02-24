import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from './api';
import { QUERY_KEYS, invalidateQueries } from './cacheUtils';

export const useBooks = ({ page = 1, limit = 10 } = {}, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.books, { page, limit }],
    queryFn: () => api.get('/books', { params: { page, limit } }).then((res) => res.data),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useAddBook = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookData) => {
      const response = await api.post('/books', bookData);
      return response.data;
    },

    onMutate: async (newBookData) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.books });

      const tempBook = {
        id: `temp-${Date.now()}`,
        ...newBookData,
        availableCopies: newBookData.numberOfCopies || 0,
        totalCopies: newBookData.numberOfCopies || 0,
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };

      const booksQueriesData = queryClient.getQueriesData({ queryKey: QUERY_KEYS.books });
      const rollbackData = [];

      booksQueriesData.forEach(([queryKey, data]) => {
        if (data && data.books) {
          rollbackData.push({ queryKey, previousData: data });
          const isFirstPage = queryKey[1]?.page === 1 || !queryKey[1]?.page;

          if (isFirstPage) {
            queryClient.setQueryData(queryKey, {
              ...data,
              books: [tempBook, ...data.books],
              totalCount: data.totalCount + 1,
            });
          }
        }
      });

      return { rollbackData, optimisticBook: tempBook };
    },

    onSuccess: (savedBook, variables, context) => {
      // Handle optimistic update replacement
      const booksQueriesData = queryClient.getQueriesData({ queryKey: QUERY_KEYS.books });

      booksQueriesData.forEach(([queryKey, data]) => {
        if (data && data.books) {
          queryClient.setQueryData(queryKey, {
            ...data,
            books: data.books
              .filter(book => !book.isOptimistic)
              .concat(savedBook),
          });
        }
      });

      invalidateQueries(queryClient, [QUERY_KEYS.books]);

      // Call component's onSuccess if provided
      options.onSuccess?.(savedBook, variables, context);
    },

    onError: (error, variables, context) => {
      if (context?.rollbackData) {
        context.rollbackData.forEach(({ queryKey, previousData }) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }

      // Call component's onError if provided
      options.onError?.(error, variables, context);
    },

    ...options
  });
};

export const useDeleteBook = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId) => {
      await api.delete(`/books/${bookId}`);
      return bookId;
    },

    onMutate: async (bookId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.books });

      const booksQueriesData = queryClient.getQueriesData({ queryKey: QUERY_KEYS.books });
      const rollbackData = [];

      booksQueriesData.forEach(([queryKey, data]) => {
        if (data && data.books) {
          rollbackData.push({ queryKey, previousData: data });
          queryClient.setQueryData(queryKey, {
            ...data,
            books: data.books.filter(book => book.id !== bookId),
            totalCount: Math.max(0, data.totalCount - 1),
          });
        }
      });

      return { rollbackData };
    },

    onSuccess: (data, bookId, context) => {
      invalidateQueries(queryClient, [QUERY_KEYS.books]);

      // Call component's onSuccess if provided
      options.onSuccess?.(data, bookId, context);
    },

    onError: (error, bookId, context) => {
      if (context?.rollbackData) {
        context.rollbackData.forEach(({ queryKey, previousData }) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }

      // Call component's onError if provided
      options.onError?.(error, bookId, context);
    },

    ...options
  });
};
