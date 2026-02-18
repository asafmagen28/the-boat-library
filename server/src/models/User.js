import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcryptjs";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Assuming usernames should be unique
      validate: {
        notEmpty: { msg: "Username cannot be empty" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: "Password must be at least 6 characters long",
        },
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "lib_users",
    timestamps: true,
    paranoid: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    indexes: [
      { fields: ["roleId"] },
    ],
  }
);

User.beforeSave(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default User;
