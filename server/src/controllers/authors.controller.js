import { getAllAuthors, createAuthor, deleteAuthor } from "../services/authors.service.js";
import AppError from "../utils/AppError.js";

export const listAuthors = async (req, res) => {
  const authors = await getAllAuthors();
  return res.json(authors);
};

export const addAuthor = async (req, res) => {
  const { firstName, surname } = req.body;

  if (!firstName || !surname) {
    throw new AppError("firstName and surname are required", 400);
  }

  const author = await createAuthor({ firstName, surname });
  return res.status(201).json(author);
};

export const removeAuthor = async (req, res) => {
  const author = await deleteAuthor(req.params.id);
  return res.json(author);
};
