import { Book, Author, Copy, Loan, sequelize } from "../models/index.js";

export const getAuthorPayments = async () => {
  return Author.findAll({
    attributes: [
      'id',
      'firstName',
      'surname',
      [sequelize.fn('COUNT', sequelize.col('books.copies.loans.id')), 'loanCount'],
      [sequelize.fn('SUM', sequelize.col('books.copies.loans.fee')), 'totalPayment'],
    ],
    include: [{
      model: Book,
      as: 'books',
      attributes: [],
      required: false,
      include: [{
        model: Copy,
        as: 'copies',
        attributes: [],
        required: false,
        include: [{
          model: Loan,
          as: 'loans',
          attributes: [],
          required: false,
        }],
      }],
    }],
    group: ['Author.id', 'Author.firstName', 'Author.surname'],
    order: [[sequelize.literal('"totalPayment"'), 'DESC']],
    subQuery: false,
  });
};

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
