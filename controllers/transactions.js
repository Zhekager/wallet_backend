/////////////////////////////////////////////////////////////////////////////////////
// const Transactions = require('../repository/transactions');
// const User = require('../repository/users');
// const Categories = require('../repository/categories');            <= зміни в коді
// const { HttpCode } = require('../helpers/constants');
// const { CustomError } = require('../helpers/customError');

// const getTransactions = async (req, res) => {
//     const userId = req.user?._id;
//     const { data, transactions } = await Transactions.listTransactions(userId, req.query);   <= зміни в коді
//     const years = [...new Set(transactions.map(({ year }) => year))].sort();                  <= зміни в коді
//     res.json({
//         status: 'Success',
//         code: HttpCode.OK,
//         message: 'Transactions found',
//         data: {years, transactions, data }                    <= зміни в коді
//     });
//////////////////////////////////////////////////////////////////////////////////////////////
const Transactions = require("../repository/transactions");
const User = require("../repository/users");
const { HttpCode } = require("../helpers/constants");
const { CustomError } = require("../helpers/customError");

const getTransactions = async (req, res) => {
  const userId = req.user?._id;
  // const userId = req.user && req.user.id;
  const data = await Transactions.listTransactions(userId, req.query);
  res.json({
    status: "Success",
    code: HttpCode.OK,
    message: "Transactions found",
    data: { ...data },
  });
////////////////////////////////////////////////////////////////////////////////////////////////////
};

const getTransactionById = async (req, res) => {
  const userId = req.user._id;
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
////////////////////////////////////////////////////////////////////////////////////
//     try {
//         const userId = req.user?._id;
//         const balanceUser = Number(req.user?.balance);    <= зміни в коді
//         const { sum, isExpense } = req.body;          <= зміни в коді
//         const sumNumber = parseInt(sum);

//         const transactionBalance = countBalance(isExpense, balanceUser, sumNumber);  <= зміни в коді

//         await User.addBalance(userId, transactionBalance);

//         const transaction = await Transactions.addTransaction({
//             ...req.body,
//             owner: userId,
//             balance: transactionBalance,
//         });
//         res.status(HttpCode.CREATED).json({
//             status: "Success",
//             code: HttpCode.CREATED,
//             data: { transaction },
//         });
        
//     } catch (error) {
//         next(error);
//     }
/////////////////////////////////////////////////////////////////////////////////////////////////
  try {
    const userId = req.user?.id;
    // const userId = req.user && req.user.id;
    const balance = req.user?.balance;
    // const balance = req.user && req.user.balance;
    const { sum, type } = req.body;
    const sumNumber = parseInt(sum);

    const transactionBalance = countBalance(type, balance, sumNumber);

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
//   try {
// const userId = req.user?._id;
// const balanceUser = Number(req.user?.balance);
//     const { sum, isExpense } = req.body;
//     const sumNumber = parseInt(sum);
//     const transactionBalance = countBalance(isExpense, balanceUser, sumNumber);
//     await User.addBalance(userId, transactionBalance);
//     const transaction = await Transactions.addTransaction({
//       ...req.body,
//       owner: userId,
//       balance: transactionBalance,
//     });
//     res.status(HttpCode.CREATED).json({
//       status: "Success",
//       code: HttpCode.CREATED,
//       data: { transaction },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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
  const userId = req.user._id;
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

// const updateTransaction = async (req, res) => {
//     const { _id: userId } = req.user;
//     const { sum, type } = req.body;
//     const sumNumber = parseInt(sum);
//     const balance = Number(req.user?.balance)

//     const transactionBalance = countBalance(type, balance, sumNumber);

//     await User.addBalance(userId, transactionBalance);
//     const transaction = await Transactions.updateTransaction(
//         req.params.transId,
//         req.body,
//         userId,
//         transactionBalance,
//     );
//         res.json({
//             status: 'Success',
//             code: HttpCode.OK,
//             message: 'Transaction updated successfully',
//             data: {
//                 transaction,
//             },
//         });
//     throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
// };

/////////////////////////////////////////////////////////////////////
// Balance

// const countBalance = (isExpense, balance, payload) =>                                  <= зміни в коді
//     isExpense === false ? balance + payload : balance - payload;                       <= зміни в коді
 

// module.exports = {                                                              <= зміни в коді
//     getTransactions,
//     getTransactionById,
//     addTransaction,
//     removeTransaction,
// };
/////////////////////////////////////////////////////////////////////////////////
const getTransForTheMonth = async (req, res) => {
  const userId = req.user._id;
  const monthDate = monthCounter(req.body.date);
  const data = await Transaction.getTransforSpanOfTime(
    userId,
    req.query,
    monthDate[0],
    monthDate[1]
  );
  res.json({
    status: "Success",
    code: HttpCode.OK,
    message: "Transaction deleted",
    data: { ...data },
  });
  throw new CustomError(HttpCode.NOT_FOUND, "Not Found");
};

const getTransactionsByYear = async (req, res) => {
  const userId = req.user._id;
  const YearDate = yearCounter(req.body.date);
  const data = await Transaction.getTransYear(userId, req.query, YearDate);
  res.json({
    status: "Success",
    code: HttpCode.OK,
    message: "Transaction deleted",
    data: { ...data },
  });
  throw new CustomError(HttpCode.NOT_FOUND, "Not Found");
};

// Balance

const countBalance = (type, balance, payload) =>
  type === "+" ? balance + payload : balance - payload;

module.exports = {
  getTransactions,
  getTransactionById,
  addTransaction,
  removeTransaction,
  getTransForTheMonth,
  getTransactionsByYear,
};

