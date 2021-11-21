const Transactions = require("../repository/transactions");
const User = require("../repository/users");
const { HttpCode } = require("../helpers/constants");
===============================================================================================================

const addTransactions = async ({ body, user: { _id, balance } }, res) => {
  if (body.type === 'income') {
    const updatedBalance = (balance += body.money);
    await User.updateUserBalance(_id, { balance: updatedBalance });
  }
  if (body.type === 'spend') {
    const updatedBalance = (balance -= body.money);
    await User.updateUserBalance(_id, { balance: updatedBalance });
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// const getTransactions = async (req, res) => {                                             <=конфлікт
//   // const userId = req.user?._id;

//   const userId = req.user && req.user._id;

//   const { data, transactions } = await Transactions.listTransactions(
//     userId,
//     req.query
//   );
//   const years = [...new Set(transactions.map(({ year }) => year))].sort();
//   const monthes = [...new Set(transactions.map(({ month }) => month))].sort();
//   res.json({
//     status: "Success",
//     code: HttpCode.OK,
//     message: "Transactions found",
//     data: { monthes, years, transactions, data },
//   });
// };

// const getTransactionById = async (req, res) => {
//   // const userId = req.user?._id;
//   const userId = req.user && req.user._id;
//   const transaction = await Transactions.getTransactionById(
//     userId,
//     req.params.transId
//   );
//   if (transaction) {
//     return res.json({
//       status: "Success",
//       code: HttpCode.OK,
//       message: "Transaction found",
//       data: {
//         transaction,
//       },
//     });
//   }
//   throw new CustomError(HttpCode.NOT_FOUND, "Not Found");
// };

// // const addTransaction = async (req, res, next) => {
// //   try {
// //     const userId = req.user?._id;
// //     const balanceUser = Number(req.user?.balance);
// //     const { sum, isExpense } = req.body;
// //     const sumNumber = parseInt(sum);
// //     const transactionBalance = countBalance(isExpense, balanceUser, sumNumber);

// //     await User.addBalance(userId, transactionBalance);

// //     const transaction = await Transactions.addTransaction({
// //       ...req.body,
// //       owner: userId,
// //       balance: transactionBalance,
// //     });
// //     res.status(HttpCode.CREATED).json({
// //       status: "Success",
// //       code: HttpCode.CREATED,
// //       data: { transaction },
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// const addTransaction = async (req, res, next) => {
//   try {
//     // const userId = req.user?._id;
//     const userId = req.user && req.user._id;
//     let transactionBalance;

//     req.body.isExpense === true
//       ? // ? (transactionBalance = Number(req.user?.balance) - Number(req.body.sum))
//         // : (transactionBalance = Number(req.user?.balance) + Number(req.body.sum));
//         (transactionBalance =
//           Number(req.user && req.user.balance) - Number(req.body.sum))
//       : (transactionBalance =
//           Number(req.user && req.user.balance) + Number(req.body.sum));

//     const newTransactionBalance = await User.addBalance(
//       userId,
//       transactionBalance
//     );
//     const transaction = await Transactions.addTransaction({
//       ...req.body,
//       owner: userId,
//       balance: transactionBalance,
//     });
//     res.json({
//       status: "Success",
//       code: HttpCode.OK,
//       message: "Successfull",
//       data: {
//         transaction,
//       },
//     });
//     next(newTransactionBalance);
//   } catch (err) {
//     next(err);
    
==================================================================================================

  }


  ================================================================================================
  
  const result = await Transactions.addTransactions(_id, body, balance);

  return res.status(HttpCode.CREATED).json({
    
    //////////////////////////////////////////////////////////////////////////////////////////////////

// const removeTransaction = async (req, res) => {                          <=конфлікт
//   // const userId = req.user?._id;
//   const userId = req.user && req.user._id;
//   const transaction = await Transactions.removeTransaction(
//     userId,
//     req.params.transId
//   );
//   if (transaction) {
//     return res.json({
//       status: "Success",
//       code: HttpCode.OK,
//       message: "Transaction deleted",
//       data: {
//         transaction,
//       },
//     });
//   }
//   throw new CustomError(HttpCode.NOT_FOUND, "Not Found");
// };

// const updateTransaction = async (req, res) => {
//   const { _id: userId } = req.user;
//   const { sum, type } = req.body;
//   const sumNumber = parseInt(sum);
//   // const balance = Number(req.user?.balance);
//   const balance = Number(req.user && req.user.balance);

//   const transactionBalance = countBalance(type, balance, sumNumber);

//   await User.addBalance(userId, transactionBalance);
//   const transaction = await Transactions.updateTransaction(
//     req.params.transId,
//     req.body,
//     userId,
//     transactionBalance
//   );
//   res.json({
    
    ========================================================================================

    status: "Success",
    code: HttpCode.CREATED,
    data: { result },
  });
};

const getTransactions = async ({ user: { id } }, res) => {
  const result = await Transactions.getTransactions(id);

  return res.json({
    status: 'Success',
    code: HttpCode.OK,
    data: {
      total: result.length,
      result,
    },
  });
};

const getStatistics = async ({ user: { id }, query }, res) => {
  const amountMoney = array => array.reduce((acc, { money }) => acc + money, 0);
  const amountCategories = array =>
    array.reduce((acc, value) => {
      const category = value.category.name;
      const { money } = value;

      acc[category]
        ? (acc[category] = acc[category] += money)
        : (acc[category] = money);

      return acc;
    }, {});

  const getUniqueMonth = array =>
    array.reduce((acc, { month }) => {
      if (!acc.includes(month)) {
        acc.push(month);
      }
      return acc;
    }, []);
  const getUniqueYear = array =>
    array.reduce((acc, { year }) => {
      if (!acc.includes(year)) {
        acc.push(year);
      }
      return acc;
    }, []);

  let totalIncomeArr;
  let totalSpendArr;

  if (query.month && query.year) {
    totalIncomeArr = await Transactions.getAllIncomeByDate(
      id,
      query.month,
      query.year,
    );
    totalSpendArr = await Transactions.getAllSpendByDate(
      id,
      query.month,
      query.year,
    );
  } else {
    totalIncomeArr = await Transactions.getAllIncome(id);
    totalSpendArr = await Transactions.getAllSpend(id);
  }

  const totalIncome = amountMoney(totalIncomeArr);
  const totalSpend = amountMoney(totalSpendArr);
  const categoriesSummary = amountCategories(totalSpendArr);
  const uniqueMonth = getUniqueMonth(totalSpendArr);
  const uniqueYear = getUniqueYear(totalSpendArr);

  return res.json({
    status: 'Success',
    code: HttpCode.OK,
    data: {
      categoriesSummary,
      totalIncome,
      totalSpend,
      uniqueMonth: uniqueMonth.sort(),
      uniqueYear: uniqueYear.sort(),
    },
  });
};

module.exports = {
  addTransactions,
  getTransactions,
  getStatistics,
};
