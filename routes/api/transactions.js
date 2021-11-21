const express = require('express');
const router = express.Router();
const {
    getTransactions,
    addTransactions,
    getStatistics,
} = require('../../controllers/transactions');
const guard = require('../../helpers/guard');

router.get('/', guard, getTransactions);
router.post('/', guard, addTransactions);
router.get('/statistics', guard, getStatistics);

module.exports = router;