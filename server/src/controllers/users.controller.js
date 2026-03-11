import { getAllCustomers, getUserBudget, deleteUser, depositToUser, getUserTransactions } from "../services/users.service.js";
import { parsePositiveInt, parsePaginationParams, parseSearchParams, parseSortParams } from "../utils/validation.js";

const ALLOWED_USER_SORT_FIELDS = ["username", "budget", "createdAt"];

export const getMyBudget = async (req, res) => {
  const budget = await getUserBudget(req.user.id);
  return res.json({ budget });
};

export const listCustomers = async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const search = parseSearchParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, ALLOWED_USER_SORT_FIELDS, "username");

  const { customers, totalCustomers } = await getAllCustomers({ page, limit, search, sortBy, sortOrder });
  const totalPages = Math.ceil(totalCustomers / limit);
  return res.json({ customers, totalCustomers, totalPages, currentPage: page });
};

export const removeUser = async (req, res) => {
  const user = await deleteUser(req.params.id);
  return res.json(user);
};

export const addUserBalance = async (req, res) => {
  const result = await depositToUser(req.params.id, req.body.amount, req.user.id);
  return res.json(result);
};

export const getMyTransactions = async (req, res) => {
  const transactions = await getUserTransactions(req.user.id);
  return res.json(transactions);
};
