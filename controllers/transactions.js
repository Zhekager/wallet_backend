const Transactions = require("../repository/transactions");
const User = require("../repository/users");
const { HttpCode } = require("../helpers/constants");


const addTransactions = async ({ body, user: { id, balance } }, res, next) => {
  try {
    if (body.type === '+') {
      const updatedBalance = (balance += body.money);
      await User.updateUserBalance(id, { balance: updatedBalance });
    }
    if (body.type === '-') {
      const updatedBalance = (balance -= body.money);
      await User.updateUserBalance(id, { balance: updatedBalance });
    }

    const result = await Transactions.addTransactions(id, body, balance);

    return res.status(HttpCode.CREATED).json({
      status: "Success",
      code: HttpCode.CREATED,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};


// const addTransactions = async (req, res, next) => {
//   try {
//     const userId = req.user._id
//     const result = await Transactions.addTransactions((userId, req.body));

//     return res.status(HttpCode.CREATED).json({
//       status: "Success",
//       code: HttpCode.CREATED,
//       data: { result },
//     });
//   } catch (error) {
//     next(error);
//   }
// };


const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await Transactions.getTransactions(userId);
    return res.json({
      status: 'Success',
      code: HttpCode.CREATED,
      data: {
        total: result.length,
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

// const removeTransaction = async (req, res, next) => {
//   try {
//     const userId = req.user.id
//     const result = await Transactions.removeTransaction(
//       userId,
//       req.params.transactionId
//     )

//     if (result) {
//       return res.json({
//         status: 'success',
//         code: HttpCode.OK,
//         message: 'Transaction deleted',
//         data: { result },
//       })
//     }
//     return res.json({
//       status: 'error',
//       code: HttpCode.NOT_FOUND,
//       message: 'Not found',
//     })
//   } catch (e) {
//     next(e)
//   }
// };

// const updateTransaction = async (req, res, next) => {
//   try {
//     const userId = req.user.id
//     const result = await Transactions.updateTransaction(
//       userId,
//       req.params.transactionId,
//       req.body
//     )
//     if (result) {
//       return res.json({
//         status: 'success',
//         code: HttpCode.OK,
//         data: { result },
//       })
//     }
//     return res.json({
//       status: 'error',
//       code: HttpCode.NOT_FOUND,
//       message: 'Not found',
//     })
//   } catch (e) {
//     next(e)
//   }
// };

const getStatistics = async ({ user: { id }, query }, res) => {
  const amountMoney = array => array.reduce((acc, { money }) => acc + money, 0);
  const amountCategories = array =>
    array.reduce((acc, value) => {
      const category = value.category;
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
    code: 200,
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
  // removeTransaction,
  // updateTransaction,
  getStatistics,
};