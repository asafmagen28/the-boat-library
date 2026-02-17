import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.post("/", authenticate, (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.patch("/:id/return", authenticate, authorize(ROLES.EMPLOYEE), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});


export default router;
