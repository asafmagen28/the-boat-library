import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Author extends Model {
  declare id: number;
  declare firstName: string;
  declare surname: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

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
