import jwt from "jsonwebtoken";

/**
 * JWT authentication middleware.
 * Expects header: Authorization: Bearer <token>
 * On success, attaches decoded payload { id, roleId, roleName } to req.user.
 */
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("");

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication required" });
  }
};

export default authenticate;
