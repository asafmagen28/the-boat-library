import jwt from "jsonwebtoken";

/**
 * JWT authentication middleware.
 * Expects header: Authorization: Bearer <token>
 * On success, attaches decoded payload { id, roleId, roleName } to req.user.
 */
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    throw new AppError(message, 401);
  }
};

export default authenticate;
