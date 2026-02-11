import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class TransactionType extends Model {
  declare id: number;
  declare type: string;
}

TransactionType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "lib_transactions_type",
    timestamps: false,
  }
);

export default TransactionType;
