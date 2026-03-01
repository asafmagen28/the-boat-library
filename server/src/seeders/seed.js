import dotenv from "dotenv";
dotenv.config();

import { Status, TransactionType, sequelize } from "../models/index.js";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    // Wrap all seeding operations in a transaction
    await sequelize.transaction(async (t) => {
      // Seed Status records
      await Status.findOrCreate({
        where: { status: "available" },
        transaction: t
      });
      await Status.findOrCreate({
        where: { status: "borrowed" },
        transaction: t
      });
      console.log("Statuses seeded");

      // Seed TransactionType records
      await TransactionType.findOrCreate({
        where: { type: "borrow_charge" },
        transaction: t
      });
      await TransactionType.findOrCreate({
        where: { type: "deposit" },
        transaction: t
      });
      console.log("TransactionTypes seeded");
    });

    console.log("Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
