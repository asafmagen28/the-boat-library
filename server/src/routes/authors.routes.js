import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Employee-only routes
router.post("/", authenticate, authorize(ROLES.EMPLOYEE), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.delete("/:id", authenticate, authorize(ROLES.EMPLOYEE), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.get("/", authenticate, (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

export default router;
