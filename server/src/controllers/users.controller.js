import { getAllCustomers, getUserBudget, deleteUser, depositToUser, getUserTransactions } from "../services/users.service.js";

export const getMyBudget = async (req, res) => {
  const budget = await getUserBudget(req.user.id);
  return res.json({ budget });
};

export const listCustomers = async (req, res) => {
  const customers = await getAllCustomers();
  return res.json(customers);
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
