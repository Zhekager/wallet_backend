const Transactions = require('../repository/transactions');
const User = require('../repository/users');
const { HttpCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/customError');

const getTransactions = async (req, res) => {
    const userId = req.user?._id;
    const data = await Transactions.listTransactions(userId, req.query);
    res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Transactions found',
        data: { ...data }
    });
};

const getTransactionById = async (req, res) => {
    const userId = req.user._id;
    const transaction = await Transactions.getTransactionById(userId, req.params.transId);
    if (transaction) {
        return res.json({
            status: 'Success',
            code: HttpCode.OK,
            message: 'Transaction found',
            data: {
                transaction,
            },
        });
    }
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const addTransaction = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { sum, type } = req.body;
    const sumNumber = parseInt(sum);
    const balance = Number(req.user?.balance)

    const transactionBalance = countBalance(type, balance, sumNumber);

    await User.addBalance(userId, transactionBalance);

    const transaction = await Transactions.addTransaction({
        ...req.body,
        owner: userId,
        balance: transactionBalance,
    });
    res.status(HttpCode.CREATED).json({
        status: "Success",
        code: HttpCode.CREATED,
        data: { transaction },
    });
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');

};

// const addTransaction = async (req, res, next) => {
//     try {
//         const { _id: userId} = req.user;
//         let transactionBalance;

//             req.body.type === '+'
//                 ? (transactionBalance = Number(req.body.balance) + Number(req.body.sum))
//                 : (transactionBalance = Number(req.body.balance) - Number(req.body.sum));

//         const newTransactionBalance = await User.addBalance(userId, transactionBalance);
//         const transaction = await Transactions.addTransaction({
//             ...req.body,
//             owner: userId,
//             balance: transactionBalance,
//         });
//         res.json({
//             status: 'Success',
//             code: HttpCode.OK,
//             message: 'Successfull',
//             data: {
//                 transaction,
//             },
//         });
//         next(newTransactionBalance);
//     } catch (err) {
//         next(err);
//     }
// };

const removeTransaction = async (req, res) => {
    const userId = req.user._id;
    const transaction = await Transactions.removeTransaction(userId, req.params.transId);
    if (transaction) {
        return res.json({
            status: 'Success',
            code: HttpCode.OK,
            message: 'Transaction deleted',
            data: {
                transaction,
            },
        });
    };
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

// const updateTransaction = async (req, res) => {
//     const { _id: userId } = req.user;
//     const { sum, type } = req.body;
//     const sumNumber = parseInt(sum);
//     const balance = Number(req.user?.balance)

//     const transactionBalance = countBalance(type, balance, sumNumber);

//     await User.addBalance(userId, transactionBalance);
//     const transaction = await Transactions.updateTransaction(
//         req.params.transId,
//         req.body,
//         userId,
//         transactionBalance,
//     );
//         res.json({
//             status: 'Success',
//             code: HttpCode.OK,
//             message: 'Transaction updated successfully',
//             data: {
//                 transaction,
//             },
//         });
//     throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
// };

const getTransForTheMonth = async (req, res) => {
    const userId = req.user._id;
    const monthDate = monthCounter(req.body.date);
    const data = await Transaction.getTransforSpanOfTime(
        userId,
        req.query,
        monthDate[0],
        monthDate[1]
    );
    res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Transaction deleted',
        data: { ...data },
    });
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const getTransactionsByYear = async (req, res) => {
    const userId = req.user._id;
    const YearDate = yearCounter(req.body.date);
    const data = await Transaction.getTransYear(
        userId,
        req.query,
        YearDate,
    );
    res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Transaction deleted',
        data: { ...data },
    });
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

// Balance

const countBalance = (type, balance, payload) =>
    type === "+" ? balance + payload : balance - payload;


module.exports = {
    getTransactions,
    getTransactionById,
    addTransaction,
    removeTransaction,
    getTransForTheMonth,
    getTransactionsByYear,
};