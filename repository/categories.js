const Category = require('../model/categories');

const getCategories = async () => {
    const results = await Category.find({ });
    return results;
};

const addCategories = async (body) => {
    const results = await Category.create(body);
    return results;
};

module.exports = { getCategories, addCategories };
