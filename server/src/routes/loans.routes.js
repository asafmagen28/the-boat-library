import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { ROLES } from "../constants/roles.js";
import { borrowBook, processReturn, listAllLoans, listMyLoans } from "../controllers/loans.controller.js";

const router = Router();

router.post("/", authenticate, borrowBook);

router.patch("/:id/return", authenticate, authorize(ROLES.EMPLOYEE), processReturn);

router.get("/", authenticate, authorize(ROLES.EMPLOYEE), listAllLoans);

router.get("/my", authenticate, listMyLoans);

export default router;
