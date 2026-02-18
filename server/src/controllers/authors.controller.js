import { getAllAuthors, createAuthor, deleteAuthor } from "../services/authors.service.js";
import AppError from "../utils/AppError.js";

export const listAuthors = async (req, res) => {
  const authors = await getAllAuthors();
  return res.json(authors);
};

const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

export const addAuthor = async (req, res) => {
  const firstName = req.body.firstName?.trim();
  const surname = req.body.surname?.trim();

  if (!firstName || !surname) {
    throw new AppError("firstName and surname are required", 400);
  }

  if (!NAME_REGEX.test(firstName)) {
    throw new AppError("First name must contain only letters, spaces, hyphens, or apostrophes", 400);
  }

  if (!NAME_REGEX.test(surname)) {
    throw new AppError("Surname must contain only letters, spaces, hyphens, or apostrophes", 400);
  }

  const author = await createAuthor({ firstName, surname });
  return res.status(201).json(author);
};

export const removeAuthor = async (req, res) => {
  const author = await deleteAuthor(req.params.id);
  return res.json(author);
};
