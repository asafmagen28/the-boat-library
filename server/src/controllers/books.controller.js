import { getAllBooks, createBook, deleteBook } from "../services/books.service.js";
import AppError from "../utils/AppError.js";

export const listBooks = async (req, res) => {
  const books = await getAllBooks();
  return res.json(books);
};

export const addBook = async (req, res) => {
  const { title, authorId, price, fee, numberOfCopies } = req.body;

  if (!title || !authorId || price == null || fee == null) {
    throw new AppError("title, authorId, price, and fee are required", 400);
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
