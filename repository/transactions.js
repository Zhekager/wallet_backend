const Transaction = require('../model/transaction');

const addTransactions = async (userId, body, balance) => {
    const result = await Transaction.create({ owner: userId, ...body, balance });
    return result;
};

const getTransactions = async (userId) => {
    const result = await Transaction.find({ owner: userId });
    return result;
};

const getTransactionsByDate = async (userId, month, year) => {
    const result = await Transaction.find({ owner: userId, month, year })
    return result;
};

const getAllIncome = async (userId) => {
    const result = await Transaction.find({ owner: userId, type: '+' })
    return result;
};

const getAllIncomeByDate = async (userId, month, year) => {
    const result = await Transaction.find({ owner: userId, type: '+', month, year })
    return result;
};

const getAllSpend = async (userId) => {
    const result = await Transaction.find({ owner: userId, type: '-' })
    return result;
};

const getAllSpendByDate = async (userId, month, year) => {
    const result = await Transaction.find({ owner: userId, type: '-', month, year })
    return result;
};

module.exports = {
    addTransactions,
    getTransactions,
    getTransactionsByDate,
    getAllIncome,
    getAllIncomeByDate,
    getAllSpend,
    getAllSpendByDate,
};