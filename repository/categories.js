const Category = require('../model');

const listCategories = () => {
    const result = Category.find();
    return result;
};

module.exports = {listCategories,};