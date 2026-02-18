import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { getMyBudget, listCustomers, removeUser } from "../controllers/users.controller.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Customer routes
router.get("/me/budget", authenticate, authorize(ROLES.CUSTOMER), getMyBudget);

// Employee routes
router.get("/", authenticate, authorize(ROLES.EMPLOYEE), listCustomers);

router.delete("/:id", authenticate, authorize(ROLES.EMPLOYEE), removeUser);

router.patch("/:id/balance", authenticate, authorize(ROLES.EMPLOYEE), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

export default router;
