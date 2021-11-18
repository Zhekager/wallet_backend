const Category = require('../model/categories');
//const Transaction = require('../model/transaction');

const listCategories = () => {
    const result = Category.find();
    return result;
};

module.exports = { listCategories };


