import { Author } from "../models/index.js";
import AppError from "../utils/AppError.js";

export const getAllAuthors = async () => {
  return Author.findAll({ order: [["surname", "ASC"]] });
};

export const createAuthor = async ({ firstName, surname }) => {
  return Author.create({ firstName, surname });
};

export const deleteAuthor = async (id) => {
  const author = await Author.findByPk(id);
  if (!author) throw new AppError("Author not found", 404);
  await author.destroy();
  return author;
};
