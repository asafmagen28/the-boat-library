import bcrypt from "bcryptjs";
import { sequelize, User, Role, EmployeeCode } from "../models/index.js";
import { Op } from "sequelize";

export const loginUser = async ({ username, password }) => {
  
  const user = await User.scope(null).findOne({
    where: { username },
    include: {
      model: Role,
      as: 'role'
    },
  });

  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }  

  return { user };
};

export const registerUser = async ({ username, password, employeeCode }) => {
  const user = await User.findOne({ where: { username }, paranoid: false });
  let foundCode = null;

  if (user) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  if (employeeCode) {
    const availableEmployeeCodes = await EmployeeCode.findAll({
      where: {
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    for (const code of availableEmployeeCodes) {
      if (await bcrypt.compare(employeeCode, code.codeHash)) {
        foundCode = code;
        break;
      }
    }

    if (!foundCode) {
      const err = new Error("Invalid or expired employee code");
      err.status = 400;
      throw err;
    }
  }

  const roleName = employeeCode ? "employee" : "customer";
  const role = await Role.findOne({ where: { roleName } });

  if (!role) {
    const err = new Error("Role configuration error");
    err.status = 500;
    throw err;
  }

  const transaction = await sequelize.transaction();
  try {
    const newUser = await User.create(
      { username, password, roleId: role.id },
      { transaction }
    );

    if (foundCode) {
      await foundCode.update({ isUsed: true }, { transaction });
    }

    await transaction.commit();
    return { user: newUser };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
