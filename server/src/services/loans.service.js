import { sequelize, Loan, Copy, Book, Author, Transaction, User } from "../models/index.js";
import { getStatus, getTransactionType } from "../utils/lookupCache.js";
import { getLoanLimits } from "../config/loanLimits.js";
import AppError from "../utils/AppError.js";
import { getUserBudget } from "./users.service.js";

export const createLoan = async ({ bookId, borrowerId }) => {
  // Get the borrower's role to determine their loan limits
  const borrower = await User.findByPk(borrowerId);
  if (!borrower) throw new AppError("Borrower not found", 404);

  const loanLimits = getLoanLimits(borrower.roleId);

  const activeLoans = await Loan.count({ where: { borrowerId, returnDate: null } });
  if (activeLoans >= loanLimits.maxActiveLoans) {
    throw new AppError(`Loan limit reached (max ${loanLimits.maxActiveLoans} active loans)`, 400);
  }

  const budget = await getUserBudget(borrowerId);
  const book = await Book.findByPk(bookId);
  if (!book) throw new AppError("Book not found", 404);
  if (budget < book.price) throw new AppError("Insufficient budget", 400);

  const availableStatus = await getStatus("available");
  const borrowedStatus = await getStatus("borrowed");

  const copy = await Copy.findOne({
    where: { statusId: availableStatus.id },
    include: [{ model: Book, as: "book", where: { id: bookId } }],
  });

  if (!copy) throw new AppError("No available copy for this book", 409);

  const borrowChargeType = await getTransactionType("borrow_charge");

  const now = new Date();
  const deadLineDate = new Date(now);
  deadLineDate.setDate(deadLineDate.getDate() + loanLimits.borrowDays);

  const dbTransaction = await sequelize.transaction();
  try {
    await copy.update({ statusId: borrowedStatus.id }, { transaction: dbTransaction });

    const loan = await Loan.create(
      {
        copyId: copy.id,
        price: copy.book.price,
        fee: copy.book.fee,
        loanDate: now,
        deadLineDate,
        borrowerId,
      },
      { transaction: dbTransaction }
    );

    await Transaction.create(
      {
        amount: -Number(copy.book.price),
        targetUserId: borrowerId,
        actorId: borrowerId,
        transTypeId: borrowChargeType.id,
        loanId: loan.id,
      },
      { transaction: dbTransaction }
    );

    await dbTransaction.commit();
    return loan;
  } catch (err) {
    await dbTransaction.rollback();
    throw err;
  }
};

export const returnLoan = async ({ loanId }) => {
  const loan = await Loan.findByPk(loanId, {
    include: [{ model: Copy, as: "copy" }],
  });

  if (!loan) throw new AppError("Loan not found", 404);
  if (loan.returnDate) throw new AppError("Loan already returned", 409);

  const availableStatus = await getStatus("available");

  const dbTransaction = await sequelize.transaction();
  try {
    await loan.copy.update({ statusId: availableStatus.id }, { transaction: dbTransaction });
    await loan.update({ returnDate: new Date() }, { transaction: dbTransaction });

    await dbTransaction.commit();
    return loan;
  } catch (err) {
    await dbTransaction.rollback();
    throw err;
  }
};

export const getAllLoans = async () => {
  return await Loan.findAll(
    {
      include: [
        { model: User, as: 'borrower' },
        {
          model: Copy, as: 'copy', include: [
            {
              model: Book, as: 'book', include: [
                { model: Author, as: 'author' }
              ]
            }
          ]
        }
      ],
      where: { returnDate: null },
      order: [["loanDate", "DESC"]],
    });
};

export const getMyLoans = async (borrowerId) => {
  return await Loan.findAll(
    {
      include: [
        {
          model: Copy, as: 'copy', include: [
            {
              model: Book, as: 'book', include: [
                { model: Author, as: 'author' }
              ]
            }
          ]
        }
      ],
      where: { borrowerId },
      order: [["loanDate", "DESC"]],
    });
};
