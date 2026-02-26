import { ROLES } from '../constants/roles.js';

export const LOAN_LIMITS = {
  [ROLES.CUSTOMER]: {
    maxActiveLoans: 3,
    borrowDays: 14
  },
  [ROLES.EMPLOYEE]: {
    maxActiveLoans: 10,
    borrowDays: 30
  }
};

export const getLoanLimits = (roleId) => {
  const limits = LOAN_LIMITS[roleId];
  if (!limits) {
    // Default to customer limits for unknown roles
    return LOAN_LIMITS[ROLES.CUSTOMER];
  }
  return limits;
};