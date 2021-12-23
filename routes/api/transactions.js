const express = require('express');
const router = express.Router();
const {
    getTransactions,
    addTransactions,
    // removeTransaction,
    // updateTransaction,
    getStatistics,
} = require('../../controllers/transactions');
const guard = require('../../helpers/guard');

router.get('/', guard, getTransactions);
router.post('/', guard, addTransactions);
// router.delete('/:transactionId', guard, removeTransaction);
// router.patch('/:transactionId', guard, updateTransaction);
router.get('/statistics', guard, getStatistics);

module.exports = router;