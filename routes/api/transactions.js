const express = require('express');
const router = express.Router();
const {
    getTransactions,
    getTransactionById,
    addTransaction,
    //removeTransaction,
    //updateTransaction,
} = require('../../controllers/transactions');
const guard = require('../../helpers/guard');

router.get('/', getTransactions);
router.get('/:transId', guard, getTransactionById);
//router.get('/month', guard, getTransForTheMonth);
//router.get('/statistic', guard, getStatistic);
router.post('/', guard, addTransaction);
//router.delete('/:transId', guard, removeTransaction);
//router.patch('/:transId', guard, updateTransaction);


module.exports = router;