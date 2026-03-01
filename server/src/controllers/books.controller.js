import { getAllBooks, createBook, deleteBook } from "../services/books.service.js";
import AppError from "../utils/AppError.js";
import { parsePositiveInt, parseNumber, parsePaginationParams } from "../utils/validation.js";

export const listBooks = async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const { books, totalBooks } = await getAllBooks({ page, limit });
  const totalPages = Math.ceil(totalBooks / limit);
  return res.json({ books, totalBooks, totalPages, currentPage: page });
};

export const addBook = async (req, res) => {
  const title = req.body.title?.trim();
  const { numberOfCopies } = req.body;

  if (!title || req.body.authorId == null || req.body.price == null || req.body.fee == null) {
    throw new AppError("title, authorId, price, and fee are required", 400);
  }

  const authorId = parsePositiveInt(req.body.authorId, "authorId");
  const price = parseNumber(req.body.price, "price");
  const fee = parseNumber(req.body.fee, "fee");

  if (price < 0) {
    throw new AppError("Price cannot be negative", 400);
  }

  if (fee < 0) {
    throw new AppError("Fee cannot be negative", 400);
  }

  if (fee > price) {
    throw new AppError("Fee cannot be greater than the price", 400);
  }

  if (numberOfCopies != null && (!Number.isInteger(Number(numberOfCopies)) || Number(numberOfCopies) < 1)) {
    throw new AppError("Number of copies must be a whole number greater than or equal to 1", 400);
  }

  const book = await createBook({
    title,
    authorId,
    price,
    fee,
    numberOfCopies: numberOfCopies || 1,
  });
  return res.status(201).json(book);
};

export const removeBook = async (req, res) => {
  const id = parsePositiveInt(req.params.id);
  const book = await deleteBook(id);
  return res.json(book);
};
