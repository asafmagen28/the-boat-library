import { generateEmployeeCode } from "../services/employeeCode.service.js";


export const generateCode = async (req, res) => {
  const { generatedCode, expiresAt } = await generateEmployeeCode({ createdById: req.user.id });
  return res.status(201).json({ code: generatedCode, expiresAt });
};

