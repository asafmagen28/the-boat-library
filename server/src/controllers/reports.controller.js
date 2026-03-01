import { getBestSellers } from "../services/reports.service.js";

export const listBestSellers = async (req, res) => {
  const books = await getBestSellers();
  return res.json(books);
};
