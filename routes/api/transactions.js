const express = require('express');
const router = express.Router();
const {
    getTransactions,
    getTransactionById,
    addTransaction,
    getTransactionStatistics,
} = require('../../controllers/transactions');
const guard = require('../../helpers/guard');

router.get('/', guard, getTransactions);
router.get('/:transId', guard, getTransactionById);
router.post('/', guard, addTransaction);
router.get('/statistics', guard, getTransactionStatistics);

module.exports = router;