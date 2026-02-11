import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Add your route files here
// Example: router.use("/books", booksRouter);

export default router;
