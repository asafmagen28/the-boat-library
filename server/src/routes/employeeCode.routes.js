import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { ROLES } from "../constants/roles.js";
import { generateCode } from "../controllers/employeeCode.controller.js";

const router = Router();

// Employee-only routes
router.post("/", authenticate, authorize(ROLES.EMPLOYEE), generateCode) ;

export default router;
