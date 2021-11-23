const Transactions = require("../repository/transactions");
const User = require("../repository/users");
const { HttpCode } = require("../helpers/constants");


const addTransactions = async ({ body, user: { id, balance } }, res) => {
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
};


const getTransactions = async ({ user: { id } }, res) => {
  const result = await Transactions.getTransactions(id);

  return res.json({
    status: 'Success',
    code: 200,
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
        acc.push(month.toLocaleDateString().slice(4, 6),);
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
  getStatistics,
};