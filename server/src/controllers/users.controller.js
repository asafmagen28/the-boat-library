import { Transaction } from "../models/index.js";

/**
 * GET /users/me/budget
 * Returns the current user's budget (sum of all their transactions).
 * req.user is guaranteed by authenticate middleware.
 */
export const getMyBudget = async (req, res) => {
  const totalAmount = await Transaction.sum("amount",{ where: { targetUserId: req.user.id }});
  return res.json({budget: totalAmount || 0});
};
