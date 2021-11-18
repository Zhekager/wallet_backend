const Transaction = require('../model/transaction');

const listTransactions = async (userId, query) => {
    const {
        sortBy = 'date',
        sortByDesc,
        limit = 5,
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
        populate: {
            path: 'category',
            select: 'color',
        },
    });
    const { docs: transactions, ...data} = results;
    //delete results.docs;
    return { data, transactions };
};

// const listTransactions = async (userId) => {
//     const results = await Transaction.find({
//         owner: userId,
//     })
//         .populate({
//             path: 'owner',
//             select: '_id',
//         })
//         .sort({ date: -1 })
//     return results
// }

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

const listTransStats = async (userId, month, year) => {
    const allTransactions = await Transaction.find({ month, year });

    const stats = allTransactions.reduce((acc, { category, sum }) => {
        const id = category.toString();

        return {
            ...acc,
            [id]: acc[id] ? acc[id] + sum : sum,
        };
    }, {});

    return stats;
};

module.exports = {
    listTransactions,
    getTransactionById,
    removeTransaction,
    addTransaction,
    updateTransaction,
    listTransStats,
};