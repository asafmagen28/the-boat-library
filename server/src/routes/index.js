import { Router } from "express";
import authRouter from "./auth.routes.js";
import usersRouter from "./users.routes.js";
import booksRouter from "./books.routes.js";
import authorsRouter from "./authors.routes.js";
import reportsRouter from "./reports.routes.js";
import loanRouter from "./loans.routes.js";
import employeeCodeRouter from "./employeeCode.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/books", booksRouter);
router.use("/authors", authorsRouter);
router.use("/reports", reportsRouter);
router.use("/loans", loanRouter);
router.use("/employee-codes", employeeCodeRouter);

export default router;
