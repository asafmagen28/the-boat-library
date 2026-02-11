import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Book extends Model {
  declare id: number;
  declare title: string;
  declare authorId: number;
  declare price: number;
  declare fee: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorId: {
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
  },
  {
    sequelize,
    tableName: "lib_books",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ["authorId"],
      }
    ]
  }
);

export default Book;
