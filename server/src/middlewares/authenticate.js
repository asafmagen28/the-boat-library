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
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.warn("JWT auth failed:", error.name);
    const message = error.name === "TokenExpiredError" ? "Token has expired"
      : error.name === "JsonWebTokenError" ? "Token is invalid"
      : "Authorization error";
    return res.status(401).json({ error: message });
  }
};

export default authenticate;
