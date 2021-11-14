const Transactions = require('../repository/transactions');
const { HttpCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/customError');
const Transaction = require('../model/transaction');

const getTransactions = async (req, res) => {
    const userId = req.user._id;
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

const addTransaction = async (req, res) => {
    const userId = req.user._id;
    const transaction = await Transactions.addTransaction(userId, req.body);
    res.status(HttpCode.CREATED).json({
        status: 'Success',
        code: HttpCode.CREATED,
        message: 'Transaction successfully created',
        data: {
            transaction,
        },
    });
};

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

const updateTransaction = async (req, res) => {
    const userId = req.user._id;
    const transaction = await Transaction.updateTransaction(
        userId,
        req.params.transId,
        req.body,
    );
    if (transaction) {
        return res.json({
            status: 'Success',
            code: HttpCode.OK,
            message: 'Transaction updated successfully',
            data: {
                transaction,
            },
        });
    };
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

module.exports = {
    getTransactions,
    getTransactionById,
    addTransaction,
    removeTransaction,
    updateTransaction,
}