import { getAllCustomers, getUserBudget, deleteUser } from "../services/users.service.js";

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
