import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "lib_role",
    timestamps: false,
  }
);

export default Role;
