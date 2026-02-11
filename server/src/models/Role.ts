import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Role extends Model {
  declare id: number;
  declare roleName: string;
}

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
