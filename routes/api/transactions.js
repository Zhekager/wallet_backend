const express = require('express');
const router = express.Router();
const {
    getTransactions,
    getTransactionById,
    addTransaction,
    removeTransaction,
    updateTransaction,
} = require('../../controllers/transactions');
const guard = require('../helpers/guard');

router.get('/', guard, getTransactions);
router.get('/:transId', guard, getTransactionById);
router.post('/', guard, addTransaction);
router.delete('/:transId', guard, removeTransaction);
router.patch('/:transId', guard, updateTransaction);

module.exports = router;