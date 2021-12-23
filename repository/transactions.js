const Transaction = require('../model/transaction');

const getTransactions = async (userId) => {
    const result = await Transaction.find({ owner: userId });
    return result;
};


const addTransactions = async (userId, body, balance) => {
    const result = await Transaction.create({ owner: userId, ...body, balance });
    return result;
};

// const addTransactions = async (userId, body) => {
//     const lastTransactionBalance = await getLatestBalance(body.date, userId)
//     const currentBalance = await calculateCurrentBalance(
//         lastTransactionBalance,
//         body
//     )
//     await Transaction.create({
//         owner: userId,
//         ...body,
//         balance: currentBalance,
//     })
//     await recalculateBalance(body.date, currentBalance, userId, false)
//     const results = await getTransactions(userId)
//     return results
// }

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

// const removeTransaction = async (userId, transactionId) => {
//     const result = await Transaction.findOneAndDelete({
//         _id: transactionId,
//         owner: userId,
//     })
//     const lastTransaction = await Transaction.find({
//         date: { $lte: result.date },
//         owner: userId,
//     })
//         .sort({ date: -1 })
//         .limit(1)

//     if (lastTransaction.length !== 0) {
//         console.log('removeTransaction length > 0')
//         await recalculateBalance(
//             result.date,
//             lastTransaction[0].balance,
//             userId,
//             false
//         )
//     } else {
//         console.log('removeTransaction length === 0')
//         await recalculateBalance(result.date, '0', userId, false)
//     }

//     const results = await getTransactions(userId)
//     return results
// }

// const updateTransaction = async (userId, transactionId, body) => {
//     const result = await Transaction.findOneAndUpdate(
//         { _id: transactionId, owner: userId },
//         { ...body },
//         { new: true }
//     )
//     const lastTransaction = await Transaction.find({
//         date: { $lt: result.date },
//         owner: userId,
//     })
//         .sort({ date: -1 })
//         .limit(1)
//     if (lastTransaction.length !== 0) {
//         await recalculateBalance(
//             lastTransaction[0].date,
//             lastTransaction[0].balance,
//             userId,
//             false
//         )
//     } else await recalculateBalance(result.date, '0', userId, true)
//     const results = await getTransactions(userId)
//     return results
// }

/////////Balance//////

// //баланс предыдущей транзакции
// const getLatestBalance = async (date, userId) => {
//     const lastTransaction = await Transaction.find({
//         date: { $lte: date },
//         owner: userId,
//     })
//         .sort({ date: -1 })
//         .limit(1)
//     if (!lastTransaction || lastTransaction.length === 0) {
//         return 0
//     } else return lastTransaction[0].balance
// }

// //баланс добавляемой транзакции
// const calculateCurrentBalance = (balance, body) => {
//     if (body.type === '+') {
//         return parseInt(balance + body.money)
//     } else return parseInt(balance - body.money)
// }

// //перерасчет баланса по дате за добавляемой транзакций
// const recalculateBalance = async (
//     date,
//     currentBalance,
//     userId,
//     isLatestTransaction
// ) => {
//     let balance = currentBalance
//     const transactions = await Transaction.find({
//         date: isLatestTransaction ? { $gte: date } : { $gt: date },
//         owner: userId,
//     }).sort({ date: 'asc' })

//     await transactions.forEach(async (el) => {
//         balance = calculateCurrentBalance(balance, el)
//         await Transaction.updateOne(
//             { _id: el.id },
//             { balance: balance },
//             function (err) {
//                 if (err) {
//                     console.log(err)
//                 } else {
//                     console.log('Success update')
//                 }
//             }
//         )
//     })
// }

module.exports = {
    addTransactions,
    getTransactions,
    getTransactionsByDate,
    getAllIncome,
    getAllIncomeByDate,
    getAllSpend,
    getAllSpendByDate,
    // removeTransaction,
    // updateTransaction,
    // getLatestBalance,
    // calculateCurrentBalance,
    // recalculateBalance,
};