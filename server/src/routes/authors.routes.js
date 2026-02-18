import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { ROLES } from "../constants/roles.js";
import { listAuthors, addAuthor, removeAuthor } from "../controllers/authors.controller.js";

const router = Router();

router.get("/", authenticate, listAuthors);

router.post("/", authenticate, authorize(ROLES.EMPLOYEE), addAuthor);

router.delete("/:id", authenticate, authorize(ROLES.EMPLOYEE), removeAuthor);

export default router;
