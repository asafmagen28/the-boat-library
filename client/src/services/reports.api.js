import { useQuery } from '@tanstack/react-query';
import api from './api';
import { QUERY_KEYS } from './cacheUtils';

const normalizeBestSellers = (books = []) => {
  return books.map((book) => ({
    ...book,
    loanCount: Number.parseInt(book.loanCount, 10) || 0,
  }));
};

const normalizeAuthorPayments = (authors = []) => {
  return authors.map((author) => ({
    ...author,
    loanCount: Number.parseInt(author.loanCount, 10) || 0,
    totalPayment: Number.parseFloat(author.totalPayment) || 0,
  }));
};

export const useBestSellers = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.bestSellers,
    queryFn: () => api.get('/reports/best-sellers').then((res) => res.data),
    select: normalizeBestSellers,
    ...options,
  });
};

export const useAuthorPayments = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.authorPayments,
    queryFn: () => api.get('/reports/author-payments').then((res) => res.data),
    select: normalizeAuthorPayments,
    ...options,
  });
};
