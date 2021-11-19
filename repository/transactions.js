const Transaction = require('../model/transaction');

const listTransactions = async (userId, query) => {
    const {
        sortBy = 'date',
        sortByDesc,
        limit = 10,
        page = 1,
        filter,
    } = query;
    const searchOptions = { owner: userId };
    const results = await Transaction.paginate(searchOptions, {
        limit,
        page,
        sort: {
            ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
            ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
        },
        select: filter ? filter.split('|').join(' ') : '',
    });
    const { docs: transactions, ...data } = results;
    delete results.docs;
    return { data, transactions };
};

const getTransactionById = async (userId, transId) => {
    const result = await Transaction.findOne({ _id: transId, owner: userId, })
    return result;
};

const removeTransaction = async (userId, transId) => {
    const result = await Transaction.findOneAndRemove({
        _id: transId,
        owner: userId,
    });
    return result;
};

const addTransaction = async (body, userId,) => {
    const transactions = await Transaction.create({ ...body, userId });
    return transactions;
};

const updateTransaction = async (transId, body, userId) => {
    const result = await Transaction.findOneAndUpdate(
        { _id: transId, owner: userId },
        { ...body },
        { new: true },
    );
    return result;
};

const listTransactionStats = async (userId, month, year) => {
    const allTransactions = await Transaction.find({
        owner: userId,
        month: month,
        year: year,
    });

    const statistic = allTransactions.reduce((acc, { isExpense, category, sum }) => ({
        ...acc,
        [category]:
            acc[category] && isExpense === false
                ? acc[category] + sum
                : acc[category] && isExpense === true
                    ? acc[category] - sum
                    : !acc[category] && isExpense === false
                        ? -sum
                        : sum,
    }),
        {}
    );
    const totalIncome = transactions.reduce(
        (acc, { sum, isExpense }) => (isExpense === false ? acc + sum : acc),
        0
    );
    const totalExpence = transactions.reduce(
        (acc, { sum, isExpense }) => (isExpense === true ? acc + sum : acc),
        0
    );

    const result = {
        ...statistic,
        totalIncome: totalIncome,
        totalExpence: totalExpence,
    };
    return result;
};

// const listTransactionStats = async (month, year, userId) => {
//     const transactions = await Transaction.find({
//         owner: userId,
//         month,
//         year,
//     })
//         .populate({
//             path: 'owner',
//             select: '_id',
//         })
//     const income = calculateIncome(transactions)
//     const consumption = calculateConsumption(transactions)

//     const consumptionTransactions = transactions.filter((el) => !el.isExpense)
//     const groupedTransactions = groupBy(consumptionTransactions, 'category')

//     const categories = Object.keys(groupedTransactions).map((element) => {
//         return {
//             category: element,
//             sum: calculateSumByCategory(groupedTransactions[element]),
//         }
//     })
//     return {
//         categories: categories,
//         income: income,
//         consumption: consumption,
//         owner: userId,
//     }
// };

// const groupBy = function (xs, key) {
//     return xs.reduce(function (rv, x) {
//         ; (rv[x[key]] = rv[x[key]] || []).push(x)
//         return rv
//     }, {})
// }

// const calculateSumByCategory = (transactions) => {
//     return transactions.reduce(
//         (total, element) => (total += parseInt(element.sum)),
//         0
//     )
// }

// const calculateIncome = (transactions) => {
//     const incomeArray = transactions.filter((el) => el.isExpense)

//     const income = incomeArray.reduce(
//         (total, el) => (total += parseInt(el.sum)),
//         0
//     )
//     return income
// };

// const calculateConsumption = (transactions) => {
//     const consumptionArray = transactions.filter((el) => !el.isExpense)
//     const consumption = consumptionArray.reduce(
//         (total, el) => (total += el.sum),
//         0
//     )
//     return consumption
// };

module.exports = {
    listTransactions,
    getTransactionById,
    removeTransaction,
    addTransaction,
    updateTransaction,
    listTransactionStats,
};