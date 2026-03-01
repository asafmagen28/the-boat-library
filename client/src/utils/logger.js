const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: isDev ? console.log : () => {},
  info: isDev ? console.info : () => {},
  warn: console.warn,
  error: console.error
};

export const apiLogger = {
  request: (method, url, data) => {
    if (isDev) {
      console.log(`🚀 API ${method.toUpperCase()} ${url}`, data ? { data } : '');
    }
  },

  response: (method, url, response) => {
    if (isDev) {
      console.log(`✅ API ${method.toUpperCase()} ${url} - Status: ${response.status}`, { data: response.data });
    }
  },

  error: (method, url, error) => {
    console.error(`💥 API ${method.toUpperCase()} ${url} failed:`, error);
  },

  optimistic: (action, data) => {
    if (isDev) {
      console.log(`🔄 Optimistic ${action}:`, data);
    }
  },

  rollback: (action, reason) => {
    if (isDev) {
      console.warn(`↩️ Rolling back ${action}:`, reason);
    }
  }
};