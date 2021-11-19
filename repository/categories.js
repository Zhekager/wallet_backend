const Category = require('../model/categories');

const listCategories = async (name) => {
    const results = await Category.find(name);
    return results;
};

module.exports = { listCategories };


