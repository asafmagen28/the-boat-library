import { getBestSellers, getAuthorPayments } from "../services/reports.service.js";

export const listBestSellers = async (req, res) => {
  const books = await getBestSellers();
  return res.json(books);
};

export const listAuthorPayments = async (req, res) => {
  const authors = await getAuthorPayments();
  return res.json(authors);
};
