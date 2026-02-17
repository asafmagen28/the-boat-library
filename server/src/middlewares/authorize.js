/**
 * Role-based authorization middleware factory.
 * Usage: authorize("employee") or authorize("customer", "employee")
 * Must be used AFTER authenticate middleware (expects req.user to exist).
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {    
    if (!req.user || !allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

export default authorize;
