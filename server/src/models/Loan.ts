import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Loan extends Model {
  declare id: number;
  declare copyId: number;
  declare price: number;
  declare fee: number;
  declare loanDate: string;
  declare deadLineDate: string;
  declare returnDate: string | null;
  declare borrowerId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Loan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    copyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    loanDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    deadLineDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    borrowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "lib_loans",
    timestamps: true,
    indexes: [
      { fields: ["copyId"] },
      { fields: ["borrowerId"] },
    ],
  }
);

export default Loan;
