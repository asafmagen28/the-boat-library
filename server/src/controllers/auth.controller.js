import jwt from "jsonwebtoken";
import { registerUser } from "../services/auth.service.js";

const generateToken = (user, roleName) => {
  return jwt.sign(
    { id: user.id, roleId: user.roleId, roleName },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export const register = async (req, res) => {
  const { username, password, employeeCode } = req.body;

  if (!username || !password) {    
    const error = new Error("Username and password are required");
    error.status = 400;
    throw error;
  }

  const { user, roleName } = await registerUser({ username, password, employeeCode });
  return res.status(201).json({ token: generateToken(user, roleName) });
};
