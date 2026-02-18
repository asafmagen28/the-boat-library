import { User, Transaction } from "../models/index.js";
import { ROLES } from "../constants/roles.js";
import AppError from "../utils/AppError.js";

export const getAllCustomers = async () => {
  return User.findAll({
    where: { roleId: ROLES.CUSTOMER },
    attributes: ["id", "username", "createdAt"],
  });
};

export const getUserBudget = async (userId) => {
  const totalAmount = await Transaction.sum("amount", { where: { targetUserId: userId } });
  return totalAmount || 0;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new AppError("User not found", 404);
  await user.destroy();
  return user;
};
