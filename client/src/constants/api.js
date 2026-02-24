export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1
};

export const TEMP_ID_PREFIX = 'temp-';

export const QUERY_KEYS = {
  AUTHORS: 'authors',
  BOOKS: 'books',
  LOANS: 'loans',
  CUSTOMERS: 'customers',
  USERS: 'users'
};

export const API_ENDPOINTS = {
  AUTHORS: '/authors',
  BOOKS: '/books',
  LOANS: '/loans',
  CUSTOMERS: '/customers',
  USERS: '/users'
};

export const CACHE_OPTIONS = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
  RETRY_ATTEMPTS: 3
};