import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { ROLES } from "../constants/roles.js";
import { listBooks, addBook, removeBook } from "../controllers/books.controller.js";

const router = Router();

router.get("/", authenticate, listBooks);

router.post("/", authenticate, authorize(ROLES.EMPLOYEE), addBook);

router.delete("/:id", authenticate, authorize(ROLES.EMPLOYEE), removeBook);

export default router;
