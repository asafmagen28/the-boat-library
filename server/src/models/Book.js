import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Book extends Model {
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
      validate: {
        notEmpty: { msg: "Title cannot be empty" },
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Price cannot be negative" },
      },
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Fee cannot be negative" },
      },
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
