import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { getMyBudget } from "../controllers/users.controller.js";

const router = Router();

// Customer routes
router.get("/me/budget", authenticate, authorize("customer"), getMyBudget);

// Employee routes
router.delete("/:id", authenticate, authorize("employee"), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.patch("/:id/balance", authenticate, authorize("employee"), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.get("/", authenticate, authorize("employee"), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

export default router;
