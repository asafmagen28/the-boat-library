import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Status extends Model {
  declare id: number;
  declare status: string;
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
