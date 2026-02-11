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
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
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
