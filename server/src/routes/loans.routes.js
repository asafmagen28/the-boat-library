import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

router.post("/", authenticate, (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

router.patch("/:id/return", authenticate, authorize("employee"), (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});


export default router;
