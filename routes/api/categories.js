const express = require('express');
const router = express.Router();
const guard = require('../../helpers/guard');
const { getCategories } = require('../../controllers/categories');

router.get('/', guard, getCategories);

module.exports = router;
