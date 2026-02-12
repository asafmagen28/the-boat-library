import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sequelize, User, Role, EmployeeCode } from "../models/index.js";
import { Op } from "sequelize";

const generateToken = (user, roleName) => {
  return jwt.sign(
    { id: user.id, roleId: user.roleId, roleName },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

/**
 * POST /api/auth/register
 * Body: { username, password, employeeCode? }
 *
 * Registration flow:
 * 1. Check if username is already taken
 * 2. Determine the role:
 *    - If employeeCode is provided → validate it (hash match, not expired, not used)
 *    - If not → default to "customer"
 * 3. Create the user with the resolved roleId
 * 4. If employee registration, mark the code as used
 * 5. Return a JWT token
 */
export const register = async (req, res) => {
  const user = await User.findOne({ where: { username : req.body.username }, paranoid: false});
  let foundCode = null;

  if (user) {
    return res.status(409).json({error: "User already exists"});
  }
  if (req.body.employeeCode) {
    const availableEmployeeCodes = await EmployeeCode.findAll(
      { where: 
        { isUsed : false,
          expiresAt : { [Op.gt] : new Date() } }
        });

    for (const code of availableEmployeeCodes) {
      if (await bcrypt.compare(req.body.employeeCode, code.codeHash)) {
        foundCode = code;
        break;
      }
    }

    if (!foundCode) {
      return res.status(400).json({error: 'Invalid or expired employee code'});
    }
  }

  const roleName = req.body.employeeCode ? 'employee' : 'customer';
  const role = await Role.findOne({ where: { roleName : roleName } });

  if (!role) {                                                                                                                                                                                            
    return res.status(500).json({ error: "Role configuration error" });
  }      

  const transaction = await sequelize.transaction();
  try {
    const newUser = await User.create(
      { username: req.body.username, password: req.body.password, roleId: role.id },
      { transaction }
    );

    if (foundCode) {
      await foundCode.update({ isUsed: true }, { transaction });
    }

    await transaction.commit();
    return res.status(201).json({ token: generateToken(newUser, roleName) });
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
