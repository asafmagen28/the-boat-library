// Legacy export for backward compatibility
export const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  NAME: /^[a-zA-Z\s'-]{2,50}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NAME: 'Name must be 2-50 characters and contain only letters, spaces, apostrophes, and hyphens',
  INVALID_USERNAME: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
  INVALID_PASSWORD: 'Password must be at least 8 characters with at least one letter and one number'
};

export const FIELD_LENGTHS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  DESCRIPTION_MAX: 500
};
