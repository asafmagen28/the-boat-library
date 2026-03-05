export function getUserFriendlyErrorMessage(error, fallbackMessage = 'Something went wrong. Please try again.') {
  const status = error?.status ?? error?.response?.status;
  const serverError = error?.data?.error ?? error?.response?.data?.error;
  const isNetworkError =
    error?.isNetworkError ||
    error?.code === 'ERR_NETWORK' ||
    error?.message === 'Network Error';

  if (isNetworkError) {
    return 'Unable to reach the server. Please check your connection and try again.';
  }

  if (status >= 500) {
    return 'Server error. Please try again in a moment.';
  }

  if (status === 401) {
    return 'Your session expired. Please log in again.';
  }

  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (status === 404) {
    return 'The requested resource was not found.';
  }

  if (status === 409) {
    return 'This action conflicts with existing data. Please refresh and try again.';
  }

  if (status === 400 || status === 422) {
    if (typeof serverError === 'string' && serverError.trim()) {
      return serverError;
    }
  }

  return fallbackMessage;
}
