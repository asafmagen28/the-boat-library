import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class EmployeeCode extends Model {
  declare id: number;
  declare isUsed: boolean;
  declare codeHash: string;
  declare expiresAt: Date;
  declare createdById: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

EmployeeCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    codeHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "lib_employee_codes",
    timestamps: true,
    indexes: [
      { fields: ["createdById"] },
    ],
  }
);

export default EmployeeCode;
