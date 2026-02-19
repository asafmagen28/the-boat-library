import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { EmployeeCode } from "../models/index.js";

const CODE_EXPIRY_DAYS = Number(process.env.EMPLOYEE_CODE_EXPIRY_DAYS) || 7;
const CODE_EXPIRY_MS = CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const generateEmployeeCode = async ({ createdById }) => {
    const generatedCode = crypto.randomBytes(16).toString("hex");
    const codeHash = await bcrypt.hash(generatedCode, 10);
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MS);

    await EmployeeCode.create({ codeHash, expiresAt, createdById });

    return { generatedCode, expiresAt };
};

