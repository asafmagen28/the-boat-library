import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../services/auth.service.js";
import AppError from "../utils/AppError.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, roleId: user.roleId },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export const login = async (req, res) => {
  const username = req.body.username?.trim();
  const { password } = req.body;

  if (!username || !password) {
    throw new AppError("Username and password are required", 400);
  }

  const { user } = await loginUser({ username, password });
  return res.status(200).json({ token: generateToken(user) });
};

export const register = async (req, res) => {
  const username = req.body.username?.trim();
  const { password, employeeCode } = req.body;

  if (!username || !password) {
    throw new AppError("Username and password are required", 400);
  }

  const { user } = await registerUser({ username, password, employeeCode });
  return res.status(201).json({ token: generateToken(user) });
};
