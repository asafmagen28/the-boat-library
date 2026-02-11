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
