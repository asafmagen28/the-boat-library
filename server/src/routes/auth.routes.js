import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);

router.post("/login", (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

export default router;
