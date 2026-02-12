import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Transaction extends Model {
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Transaction amount is required" },
        isDecimal: { msg: "Transaction amount must be a valid decimal" },
        not0(value) {
          if (Number(value) === 0) throw new Error("Transaction amount cannot be zero");
        },
        rangeCheck(value) {
          if (Math.abs(Number(value)) > 10000) {
            throw new Error("Transaction amount exceeds maximum allowed (10,000)");
          }
        },
      },
    },
    targetUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "lib_transactions",
    timestamps: true,
    indexes: [
      { fields: ["targetUserId"] },
      { fields: ["actorId"] },
      { fields: ["transTypeId"] },
      { fields: ["loanId"] },
    ],
  }
);

export default Transaction;
