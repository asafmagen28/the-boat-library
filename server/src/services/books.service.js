import { sequelize, Book, Author, Copy } from "../models/index.js";
import { getStatus } from "../utils/lookupCache.js";
import AppError from "../utils/AppError.js";

export const getAllBooks = async ({ page = 1, limit = 10 } = {}) => {
  const availableStatus = await getStatus("available");

  const { rows: books, count: totalBooks } = await Book.findAndCountAll({
    order: [["title", "ASC"]],
    limit,
    offset: (page - 1) * limit,
    distinct: true,
    include: [{ model: Author, as: "author" }],
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*) FROM "lib_copy" AS "copies"
            WHERE "copies"."bookId" = "Book"."id"
              AND "copies"."statusId" = ${availableStatus.id}
          )`),
          "availableCopies",
        ],
      ],
    },
  });

  return { books, totalBooks };
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
