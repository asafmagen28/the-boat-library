import dotenv from "dotenv";
dotenv.config();

const validateEnv = () => {
  const requiredVals = ["JWT_SECRET", "DB_USER", "DB_NAME", "DB_HOST", "DB_PORT"];
  const missingVals = requiredVals.filter((val) => !process.env[val]);
  if (missingVals.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVals.join(", ")}`
    );
    process.exit(1);
  }
};

validateEnv();

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "*",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api", routes);
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Only creates new tables, never alters or drops existing ones.
    // Replace with migrations for production schema changes.
    await sequelize.sync({ force: false, alter: false });
    console.log("Models synced.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

start();
