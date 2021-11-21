const Transaction = require('../model/transaction');

const addTransactions = async (userId, body, balance) => {
    const result = await Transaction.create({ owner: userId, ...body, balance });
    return result;
};

const getTransactions = async (userId) => {
    const result = await Transaction.find({ owner: userId })
        .populate('category')
    return result;
};

const getTransactionsByDate = async (userId, month, year) => {
    const result = await Transaction.find({ owner: userId, month, year })
        .populate('category')
    return result;
};

const getAllIncome = async (userId) => {
    const result = await Transaction.find({ owner: userId, type: 'income' })
        .populate('category')
    return result;
};

const getAllIncomeByDate = async (userId, month, year) => {
    const result = await Transaction.find({ owner: userId, type: 'income', month, year })
        .populate('category')
    return result;
};

const getAllSpend = async (userId) => {
    const result = await Transaction.find({ owner: userId, type: 'spend' })
        .populate('category')
    return result;
};

const getAllSpendByDate = async (userId, month, year) => {
    const result = await Transaction.find({ owner: userId, type: 'spend', month, year })
        .populate('category')
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