const Transaction = require('../model/transaction');

const listTransactions = async (userId, query) => {
    const {
        sortBy = 'date',
        sortByDesc,
        filter,
        limit = 10,
        page = 1,
        month = null,
        year = null,
        offset,
    } = query;

    const optionsSearch = { userId };
    const results = await Transaction.paginate(optionsSearch, {
        limit,
        offset,
        page,
        sort: {
            ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
            ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
        },
        select: filter ? filter.split('|').join(' ') : '',
        populate: [
            {
                path: 'categoryId',
                select: 'value',
            },
            {
            path: 'owner',
            select: 'name email subscription -_id',
        },
    ]
    });
    const { docs: transactions, totalDocs: total } = results
    return { transactions, total, limit, offset, page }
};

const getTransactionById = async (userId, transId) => {
    const result = await Contact.findOne({ transId, userId }).populate([
        {
            path: 'categoryId',
            select: 'value',
        },
        {
        path: 'owner',
        select: 'name email subscription -_id',
        }
    ]);
    return result;
};

const removeTransaction = async (userId, transId) => {
    const result = await Transaction.findOneAndRemove({ transId, userId });
    return result;
};

const addTransaction = async (userId, body) => {
    const result = await Contact.create({ ...body, userId });
    return result;
};

const updateTransaction = async (userId, transId, body) => {
    const result = await Transaction.findOneAndUpdate(
        { transId, userId },
        { ...body },
        { new: true }
    );
    return result;
};

module.exports = {
    listTransactions,
    getTransactionById,
    removeTransaction,
    addTransaction,
    updateTransaction,
};