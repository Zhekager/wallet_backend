const Transaction = require('../model/transaction');

const listTransactions = async (userId, query) => {
    const {
        limit = 5,
        page = 1,
    } = query;
    const searchOptions = { owner: userId };
    const results = await Transaction.paginate(searchOptions, {
        limit,
        page,
        sort: { date: "desc" },
    });
    const { docs: result } = results;
    delete results.docs;
    return { ...results, result };
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
// const getTransforSpanOfTime = async (
//     userId,
//     query,
//     start_date,
//     end_date
// ) => {
//     const { limit = 5, page = 1 } = query;
//     const searchOptions = {
//         owner: userId,
//         date: { $gte: start_date, $lte: end_date },
//     };

//     const results = await Transaction.paginate(searchOptions, {
//         limit,
//         page,
//         sort: { date: "desc" },
//     });
//     const { docs: result } = results;
//     delete results.docs;
//     return { ...results, result };
// };

// const getTransYear = async (userId, query, year) => {
//     const { limit = 5, page = 1 } = query;
//     const searchOptions = {
//         owner: userId,
//         year: year,
//     };
//     const results = await Transaction.paginate(searchOptions, {
//         limit,
//         page,
//         sort: { date: "desc" },
//     });
//     const { docs: result } = results;
//     delete results.docs;
//     return { ...results, result };
// };

module.exports = {
    listTransactions,
    getTransactionById,
    removeTransaction,
    addTransaction,
    updateTransaction,
    //getTransforSpanOfTime,
    //getTransYear,
};