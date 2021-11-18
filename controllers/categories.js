const Categories = require('../repository/categories');
const { HttpCode } = require('../helpers/constants');


const getCategories = async (req, res) => {
    const data = await Categories.listCategories();

    const expenses = data.filter(({ isExpense }) => isExpense);
    const incomes = data.filter(({ isExpense }) => !isExpense);

    res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Categories found',
        data: { expenses, incomes },
    });
};

module.exports = {
    getCategories,
};