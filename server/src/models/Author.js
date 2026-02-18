import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Author extends Model {}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name cannot be empty" },
      },
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Surname cannot be empty" },
      },
    },
  },
  {
    sequelize,
    tableName: "lib_authors",
    timestamps: true,
    paranoid: true,
  }
);

export default Author;
