import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Status extends Model {
}

Status.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "lib_status",
    timestamps: false,
  }
);

export default Status;
