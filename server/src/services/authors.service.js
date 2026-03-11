import { Op } from "sequelize";
import { sequelize, Author } from "../models/index.js";
import AppError from "../utils/AppError.js";

export const getAllAuthors = async ({ page = 1, limit = 10, search = "", sortBy = "surname", sortOrder = "ASC" } = {}) => {
  const whereClause = {};
  if (search) {
    const searchCondition = { [Op.iLike]: `%${search}%` };
    whereClause[Op.or] = [
      { firstName: searchCondition },
      { surname: searchCondition },
      sequelize.where(
        sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('surname')),
        searchCondition
      ),
      sequelize.where(
        sequelize.fn('concat', sequelize.col('surname'), ' ', sequelize.col('firstName')),
        searchCondition
      )
    ];
  }

  const { rows: authors, count: totalAuthors } = await Author.findAndCountAll({
    where: whereClause,
    order: [[sortBy, sortOrder]],
    limit,
    offset: (page - 1) * limit,
  });

  return { authors, totalAuthors };
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
