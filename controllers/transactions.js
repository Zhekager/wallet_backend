const Transactions = require('../repository/transactions');
const User = require('../repository/users');
const Categories = require('../repository/categories');
const { HttpCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/customError');
const Transaction = require('../model/transaction');

const getTransactions = async (req, res) => {
  const userId = req.user?._id;
  const { data, transactions } = await Transactions.listTransactions(userId, req.query);
  const years = [...new Set(transactions.map(({ year }) => year))].sort();
  const monthes = [...new Set(transactions.map(({ month }) => month))].sort();
  res.json({
    status: 'Success',
    code: HttpCode.OK,
    message: 'Transactions found',
    data: { monthes, years, transactions, data }
  })
};

const getTransactionById = async (req, res) => {
  const userId = req.user?._id;
  const transaction = await Transactions.getTransactionById(
    userId,
    req.params.transId
  );
  if (transaction) {
    return res.json({
      status: "Success",
      code: HttpCode.OK,
      message: "Transaction found",
      data: {
        transaction,
      },
    });
  }
  throw new CustomError(HttpCode.NOT_FOUND, "Not Found");
};

const addTransaction = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const balanceUser = Number(req.user?.balance);
    const { sum, isExpense } = req.body;
    const sumNumber = parseInt(sum);
    const transactionBalance = countBalance(isExpense, balanceUser, sumNumber);

    await User.addBalance(userId, transactionBalance);

    const transaction = await Transactions.addTransaction({
      ...req.body,
      owner: userId,
      balance: transactionBalance,
    });
    res.status(HttpCode.CREATED).json({
      status: "Success",
      code: HttpCode.CREATED,
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// const addTransaction = async (req, res, next) => {
//     try {
//         const userId = req.user?._id;
//         let transactionBalance;

//             req.body.isExpense === true
//                 ? (transactionBalance = Number(req.user?.balance) + Number(req.body.sum))
//                 : (transactionBalance = Number(req.user?.balance) - Number(req.body.sum));

//         const newTransactionBalance = await User.addBalance(userId, transactionBalance);
//         const transaction = await Transactions.addTransaction({
//             ...req.body,
//             owner: userId,
//             balance: transactionBalance,
//         });
//         res.json({
//             status: 'Success',
//             code: HttpCode.OK,
//             message: 'Successfull',
//             data: {
//                 transaction,
//             },
//         });
//         next(newTransactionBalance);
//     } catch (err) {
//         next(err);
//     }
// };

const removeTransaction = async (req, res) => {
  const userId = req.user?._id;
  const transaction = await Transactions.removeTransaction(
    userId,
    req.params.transId
  );
  if (transaction) {
    return res.json({
      status: "Success",
      code: HttpCode.OK,
      message: "Transaction deleted",
      data: {
        transaction,
      },
    });
  }
  throw new CustomError(HttpCode.NOT_FOUND, "Not Found");
};

const updateTransaction = async (req, res) => {
  const { _id: userId } = req.user;
  const { sum, type } = req.body;
  const sumNumber = parseInt(sum);
  const balance = Number(req.user?.balance)

  const transactionBalance = countBalance(type, balance, sumNumber);

  await User.addBalance(userId, transactionBalance);
  const transaction = await Transactions.updateTransaction(
    req.params.transId,
    req.body,
    userId,
    transactionBalance,
  );
  res.json({
    status: 'Success',
    code: HttpCode.OK,
    message: 'Transaction updated successfully',
    data: {
      transaction,
    },
  });
  throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const getTransactionStatistics = async (req, res) => {
  const userId = req.user._id;
  const { year, month } = req.body;
  const allCategories = await Categories.listCategories(name, userId)
  const categoriesBalances = await Transactions.listTransactionStats(
    userId,
    year,
    month
  );
  const transactionsWithCategories = [
    ...allCategories,
    "totalIncome",
    "totalExpence",
  ];
  const categoriesTotalBalance = transactionsWithCategories.reduce(
    (acc, value) => ({
      ...acc,
      [value]: categoriesBalances[value] || 0,
    }),
    {}
  );

  return res.status(HttpCode.OK).json({
    status: "OK",
    code: HttpCode.OK,
    data: categoriesTotalBalance,
  });
};

// const getTransactionStatistics = async (req, res, next) => {
//   try {
//     const userId = req.user._id
//     const { month, year } = req.query
//     const { categories, income, consumption} =
//       await Transactions.listTransactionStats(month, year, userId)

//     return res.json({
//       status: 'success',
//       code: HttpCode.OK,
//       data: {
//         categories,
//         income,
//         consumption,
//       },
//     })
//   } catch (e) {
//     next(e)
//   }
// }


// Balance

const countBalance = (isExpense, balance, payload) => {
  isExpense === false ? balance + payload : balance - payload
};

module.exports = {
  getTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  removeTransaction,
  getTransactionStatistics,
};