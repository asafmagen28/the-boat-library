import AppError from "./AppError.js";

export const parsePositiveInt = (value, fieldName = "id") => {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) {
    throw new AppError(`${fieldName} must be a positive integer`, 400);
  }
  return num;
};

export const parseNumber = (value, fieldName) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new AppError(`${fieldName} must be a number`, 400);
  }
  return num;
};

const MAX_LIMIT = 50;

export const parsePaginationParams = (query) => {
  const page = query.page != null ? parsePositiveInt(query.page, "page") : 1;
  const rawLimit = query.limit != null ? parsePositiveInt(query.limit, "limit") : 10;
  const limit = Math.min(rawLimit, MAX_LIMIT);
  return { page, limit };
};
