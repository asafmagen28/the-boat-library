import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Copy extends Model {
  declare id: number;
  declare bookId: number;
  declare statusId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Copy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "lib_copy",
    timestamps: true,
    indexes: [
      { fields: ["bookId"] },
      { fields: ["statusId"] },
    ],
  }
);

export default Copy;
