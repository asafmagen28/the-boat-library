import { getAllBooks, createBook, deleteBook } from "../services/books.service.js";
import AppError from "../utils/AppError.js";

export const listBooks = async (req, res) => {
  const books = await getAllBooks();
  return res.json(books);
};

export const addBook = async (req, res) => {
  const { authorId, price, fee, numberOfCopies } = req.body;
  const title = req.body.title?.trim();

  if (!title || !authorId || price == null || fee == null) {
    throw new AppError("title, authorId, price, and fee are required", 400);
  }

  if (Number(price) < 0) {
    throw new AppError("Price cannot be negative", 400);
  }

  if (Number(fee) < 0) {
    throw new AppError("Fee cannot be negative", 400);
  }

  if (Number(fee) > Number(price)) {
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
  const book = await deleteBook(req.params.id);
  return res.json(book);
};
