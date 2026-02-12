import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

// Employee-only report routes
router.get("/overdue", authenticate, authorize("employee"), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.get("/best-sellers", authenticate, authorize("employee"), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.get("/author-payments", authenticate, authorize("employee"), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

export default router;
