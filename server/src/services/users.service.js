import { sequelize, User, Transaction, TransactionType, Loan, Copy, Book } from "../models/index.js";
import { ROLES } from "../constants/roles.js";
import AppError from "../utils/AppError.js";

export const getAllCustomers = async () => {
  return User.findAll({
    where: { roleId: ROLES.CUSTOMER },
    attributes: [
      "id",
      "username",
      "createdAt",
      [sequelize.fn("COALESCE", sequelize.fn("SUM", sequelize.col("receivedTransactions.amount")), 0), "budget"],
    ],
    include: [{ model: Transaction, as: "receivedTransactions", attributes: [], required: false }],
    group: ["User.id"],
  });
};

export const getUserBudget = async (userId) => {
  const totalAmount = await Transaction.sum("amount", { where: { targetUserId: userId } });
  return totalAmount || 0;
};

export const depositToUser = async (userId, amount, actorId) => {
  if (!amount || amount <= 0) throw new AppError("Amount must be a positive number", 400);

  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);
  if (user.roleId !== ROLES.CUSTOMER) throw new AppError("Can only deposit to customer accounts", 400);

  const depositType = await TransactionType.findOne({ where: { type: "deposit" } });
  await Transaction.create({ amount, targetUserId: userId, actorId, transTypeId: depositType.id });

  return { newBudget: await getUserBudget(userId) };
};

export const getUserTransactions = async (userId) => {
  return Transaction.findAll({
    where: { targetUserId: userId },
    include: [
      { model: TransactionType, as: "transactionType", attributes: ["type"] },
      {
        model: Loan,
        as: "loan",
        required: false,
        attributes: ["id"],
        include: [
          {
            model: Copy,
            as: "copy",
            attributes: ["id"],
            include: [{ model: Book, as: "book", attributes: ["title"] }],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new AppError("User not found", 404);
  await user.destroy();
  return user;
};
