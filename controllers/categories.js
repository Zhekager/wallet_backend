const Categories = require("../repository/categories");
const { HttpCode } = require("../helpers/constants");

const getCategories = async (_, res) => {
    const result = await Categories.getCategories();
    return res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Categories found',
        result
    });
};

const addCategories = async ({ body }, res) => {
    const result = await Categories.addCategories(body);

    return res.status(201).json({
        status: 'Created',
        code: 201,
        data: {
            result,
        },
    });
};

module.exports = { getCategories, addCategories }