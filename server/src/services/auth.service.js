import bcrypt from "bcryptjs";
import { sequelize, User, Role, EmployeeCode } from "../models/index.js";
import { Op } from "sequelize";
import AppError from "../utils/AppError.js";

export const loginUser = async ({ username, password }) => {
  const user = await User.scope(null).findOne({
    where: { username },
    include: {
      model: Role,
      as: 'role'
    },
  });

  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  return { user };
};

export const registerUser = async ({ username, password, employeeCode }) => {
  const user = await User.findOne({ where: { username }, paranoid: false });
  let foundCode = null;

  if (user) throw new AppError("User already exists", 409);

  if (employeeCode) {
    // Bcrypt hashes can't be queried by value, so we fetch available codes
    // and compare each one.
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

    if (!foundCode) throw new AppError("Invalid or expired employee code", 400);
  }

  const roleName = employeeCode ? "employee" : "customer";
  const role = await Role.findOne({ where: { roleName } });

  if (!role) throw new AppError("Role configuration error", 500);

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
