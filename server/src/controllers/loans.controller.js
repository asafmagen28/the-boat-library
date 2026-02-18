import { createLoan, returnLoan, getAllLoans, getMyLoans } from "../services/loans.service.js";
import AppError from "../utils/AppError.js";

export const borrowBook = async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) throw new AppError("bookId is required", 400);

  const loan = await createLoan({ bookId, borrowerId: req.user.id });
  return res.status(201).json(loan);
};

export const processReturn = async (req, res) => {
  const loan = await returnLoan({ loanId: req.params.id });
  return res.json(loan);
};

export const listAllLoans = async (req, res) => {
  const loans = await getAllLoans();
  return res.json(loans);
};

export const listMyLoans = async (req, res) => {
  const loans = await getMyLoans(req.user.id);
  return res.json(loans);
};
