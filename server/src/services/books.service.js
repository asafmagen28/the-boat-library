import { sequelize, Book, Author, Copy, Status } from "../models/index.js";
import { getStatus } from "../utils/lookupCache.js";
import AppError from "../utils/AppError.js";

export const getAllBooks = async () => {
  const books = await Book.findAll({
    order: [["title", "ASC"]],
    include: [
      { model: Author, as: "author" },
      {
        model: Copy,
        as: 'copies',
        include: [{ model: Status, as: 'status' }]
      },
    ]
  });

  const availableStatus = await getStatus("available");
  return books.map((book) => {
    const bookJson = book.toJSON();
    const { copies, ...bookData } = bookJson;

    const availableCopies = copies.filter(
      (copy) => copy.statusId === availableStatus.id
    ).length;

    return {
      ...bookData,
      availableCopies
    };
  });
};

export const createBook = async ({ title, authorId, price, fee, numberOfCopies = 1 }) => {
  const existsBook = await Book.findOne({ where: { title, authorId }, paranoid: false });
  if (existsBook) throw new AppError("A book with this title and author already exists", 409);

  const author = await Author.findByPk(authorId);
  if (!author) throw new AppError("Author not found", 404);

  const availableStatus = await getStatus("available");

  const dbTransaction = await sequelize.transaction();
  try {
    const newBook = await Book.create({ title, authorId, price, fee }, { transaction: dbTransaction });

    const bookCopiesArray = Array.from({ length: numberOfCopies }, () => ({
      bookId: newBook.id,
      statusId: availableStatus.id,
    }));
    await Copy.bulkCreate(bookCopiesArray, { transaction: dbTransaction });

    await dbTransaction.commit();
    return newBook;
  } catch (err) {
    await dbTransaction.rollback();
    throw err;
  }
};

export const deleteBook = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) throw new AppError("Book not found", 404);
  await book.destroy();
  return book;
};
