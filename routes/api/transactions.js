const express = require('express');
const router = express.Router();
const {
    getTransactions,
    getTransactionById,
    addTransaction,
    //removeTransaction,
    //updateTransaction,
    getTransForTheMonth,
    getTransactionsByYear,
} = require('../../controllers/transactions');
const guard = require('../../helpers/guard');

router.get('/', guard, getTransactions);
router.get('/:transId', guard, getTransactionById);
//router.get('/month', guard, getTransForTheMonth);
router.get('/year', guard, getTransactionsByYear);
router.post('/', guard, addTransaction);
//router.delete('/:transId', guard, removeTransaction);
//router.patch('/:transId', guard, updateTransaction);


module.exports = router;