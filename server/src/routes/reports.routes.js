import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Employee-only report routes
router.get("/overdue", authenticate, authorize(ROLES.EMPLOYEE), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.get("/best-sellers", authenticate, authorize(ROLES.EMPLOYEE), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.get("/author-payments", authenticate, authorize(ROLES.EMPLOYEE), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

export default router;
