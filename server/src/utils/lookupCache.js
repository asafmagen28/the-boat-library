import { Status, TransactionType } from "../models/index.js";

const cache = {
  statuses: null,
  transactionTypes: null,
};

export const getStatus = async (statusName) => {
  if (!cache.statuses) {
    const rows = await Status.findAll();
    cache.statuses = Object.fromEntries(rows.map((r) => [r.status, r]));
  }
  const status = cache.statuses[statusName];
  if (!status) throw new Error(`Status "${statusName}" not found in lib_status. Run the seeder first.`);
  return status;
};

export const getTransactionType = async (typeName) => {
  if (!cache.transactionTypes) {
    const rows = await TransactionType.findAll();
    cache.transactionTypes = Object.fromEntries(rows.map((r) => [r.type, r]));
  }
  const type = cache.transactionTypes[typeName];
  if (!type) throw new Error(`TransactionType "${typeName}" not found in lib_transactions_type. Run the seeder first.`);
  return type;
};
