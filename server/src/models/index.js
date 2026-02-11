import sequelize from "../config/database.js";
import Role from "./Role.js";
import Status from "./Status.js";
import TransactionType from "./TransactionType.js";
import Author from "./Author.js";
import User from "./User.js";
import Book from "./Book.js";
import Copy from "./Copy.js";
import Loan from "./Loan.js";
import Transaction from "./Transaction.js";
import EmployeeCode from "./EmployeeCode.js";

// --- Associations ---

// Author <-> Book
Author.hasMany(Book, { foreignKey: "authorId", as: "books" });
Book.belongsTo(Author, { foreignKey: "authorId", as: "author" });

// Book <-> Copy
Book.hasMany(Copy, { foreignKey: "bookId", as: "copies" });
Copy.belongsTo(Book, { foreignKey: "bookId", as: "book" });

// Status <-> Copy
Status.hasMany(Copy, { foreignKey: "statusId", as: "copies" });
Copy.belongsTo(Status, { foreignKey: "statusId", as: "status" });

// Role <-> User
Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// User <-> Loan
User.hasMany(Loan, { foreignKey: "borrowerId", as: "loans" });
Loan.belongsTo(User, { foreignKey: "borrowerId", as: "borrower" });

// Copy <-> Loan
Copy.hasMany(Loan, { foreignKey: "copyId", as: "loans" });
Loan.belongsTo(Copy, { foreignKey: "copyId", as: "copy" });

// User <-> Transaction (target)
User.hasMany(Transaction, { foreignKey: "targetUserId", as: "receivedTransactions" });
Transaction.belongsTo(User, { foreignKey: "targetUserId", as: "targetUser" });

// User <-> Transaction (actor)
User.hasMany(Transaction, { foreignKey: "actorId", as: "initiatedTransactions" });
Transaction.belongsTo(User, { foreignKey: "actorId", as: "actor" });

// TransactionType <-> Transaction
TransactionType.hasMany(Transaction, { foreignKey: "transTypeId", as: "transactions" });
Transaction.belongsTo(TransactionType, { foreignKey: "transTypeId", as: "transactionType" });

// Loan <-> Transaction
Loan.hasOne(Transaction, { foreignKey: "loanId", as: "transaction" });
Transaction.belongsTo(Loan, { foreignKey: "loanId", as: "loan" });

// User <-> EmployeeCode
User.hasMany(EmployeeCode, { foreignKey: "createdById", as: "employeeCodes" });
EmployeeCode.belongsTo(User, { foreignKey: "createdById", as: "creator" });

export {
  sequelize,
  Role,
  Status,
  TransactionType,
  Author,
  User,
  Book,
  Copy,
  Loan,
  Transaction,
  EmployeeCode,
};
