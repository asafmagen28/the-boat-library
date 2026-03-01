import { Book, Author, Copy, Loan, sequelize } from "../models/index.js";

export const getBestSellers = async () => {
  return Book.findAll({
    attributes: [
      "id",
      "title",
      [sequelize.fn("COUNT", sequelize.col("copies.loans.id")), "loanCount"],
    ],
    include: [
      {
        model: Author,
        as: "author",
        attributes: ["firstName", "surname"],
      },
      {
        model: Copy,
        as: "copies",
        attributes: [],
        required: false,
        include: [
          {
            model: Loan,
            as: "loans",
            attributes: [],
            required: false,
          },
        ],
      },
    ],
    group: ["Book.id", "author.id", "author.firstName", "author.surname"],
    order: [[sequelize.literal('"loanCount"'), "DESC"]],
    limit: 10,
    subQuery: false,
  });
};
