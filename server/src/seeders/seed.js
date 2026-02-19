import dotenv from "dotenv";
dotenv.config();

import { Status, TransactionType, sequelize } from "../models/index.js";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await Status.findOrCreate({ where: { status: "available" } });
    await Status.findOrCreate({ where: { status: "borrowed" } });
    console.log("Statuses seeded");

    await TransactionType.findOrCreate({ where: { type: "borrow_charge" } });
    await TransactionType.findOrCreate({ where: { type: "deposit" } });
    console.log("TransactionTypes seeded");

    console.log("Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
