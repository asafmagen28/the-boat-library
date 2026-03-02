/**
 * Standard React Query cache utilities
 * Provides query keys and essential helpers for cache management
 */

import { PAGINATION } from '../constants/api';

// Centralized query key definitions following React Query best practices
export const QUERY_KEYS = {
  authors: ['authors'],
  books: ['books'],
  loans: ['loans'],
  myLoans: ['myLoans'],
  customers: ['customers'],
  bestSellers: ['bestSellers'],
  authorPayments: ['authorPayments'],
  myBudget: ['myBudget'],
  myTransactions: ['myTransactions'],
};

/**
 * Helper to invalidate multiple query patterns at once
 */
export const invalidateQueries = (queryClient, queryKeys) => {
  queryKeys.forEach(queryKey => {
    queryClient.invalidateQueries({ queryKey });
  });
};

/**
 * Optimistically handle loan return - Complex business logic
 * This handles cross-entity updates (loans affecting book availability)
 */
export const optimisticReturnLoan = async (queryClient, loanId) => {
  // Cancel outgoing refetches to avoid race conditions
  await queryClient.cancelQueries({ queryKey: QUERY_KEYS.loans });
  await queryClient.cancelQueries({ queryKey: QUERY_KEYS.books });

  // Get current loans data to find the loan being returned
  const currentLoans = queryClient.getQueryData(QUERY_KEYS.loans) || [];
  const loanToReturn = currentLoans.find(loan => loan.id === loanId);
  const previousLoans = queryClient.getQueryData(QUERY_KEYS.loans);

  // Optimistically remove loan from loans list
  queryClient.setQueryData(QUERY_KEYS.loans, (old = []) =>
    old.filter((loan) => loan.id !== loanId)
  );

  // Optimistically update all books queries (handle pagination)
  const bookUpdates = [];
  if (loanToReturn?.copy?.book?.id) {
    queryClient.getQueriesData({ queryKey: QUERY_KEYS.books }).forEach(([queryKey, data]) => {
      if (data && data.books) {
        const updatedData = {
          ...data,
          books: data.books.map((book) =>
            book.id === loanToReturn.copy.book.id
              ? { ...book, availableCopies: book.availableCopies + 1 }
              : book
          ),
        };
        queryClient.setQueryData(queryKey, updatedData);
        bookUpdates.push({ queryKey, previousData: data });
      }
    });
  }

  return { previousLoans, bookUpdates, loanToReturn };
};

/**
 * Optimistically handle book borrowing - Complex business logic
 * This decrements book availability across paginated queries
 */
export const optimisticBorrowBook = async (queryClient, { bookId }, page = PAGINATION.DEFAULT_PAGE) => {
  await queryClient.cancelQueries({ queryKey: QUERY_KEYS.books });
  await queryClient.cancelQueries({ queryKey: QUERY_KEYS.myLoans });

  const previousBooksData = queryClient.getQueryData([...QUERY_KEYS.books, { page, limit: PAGINATION.DEFAULT_LIMIT }]);

  queryClient.setQueryData([...QUERY_KEYS.books, { page, limit: PAGINATION.DEFAULT_LIMIT }], (old) => {
    if (!old) return old;
    return {
      ...old,
      books: old.books.map((book) =>
        book.id === bookId
          ? { ...book, availableCopies: book.availableCopies - 1 }
          : book
      ),
    };
  });

  return { previousBooksData };
};

/**
 * Rollback complex loan operations
 * Handles multiple cache updates and cross-entity relationships
 */
export const rollbackOptimisticUpdate = (queryClient, context) => {
  if (!context) return;

  // Rollback loans if available
  if (context.previousLoans !== undefined) {
    queryClient.setQueryData(QUERY_KEYS.loans, context.previousLoans);
  }

  // Rollback book updates if available
  if (context.bookUpdates && Array.isArray(context.bookUpdates)) {
    context.bookUpdates.forEach(({ queryKey, previousData }) => {
      queryClient.setQueryData(queryKey, previousData);
    });
  }

  // Rollback single books query if available
  if (context.previousBooksData !== undefined) {
    const page = PAGINATION.DEFAULT_PAGE;
    queryClient.setQueryData([...QUERY_KEYS.books, { page, limit: PAGINATION.DEFAULT_LIMIT }], context.previousBooksData);
  }
};