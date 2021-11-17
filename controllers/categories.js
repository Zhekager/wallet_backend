const Categories = require('../repository/categories');
const { HttpCode } = require('../helpers/constants');

const getCategories = async (req, res) => {
    const userId = req.user._id;
    const data = await Categories.listCategories(userId, req.query);
    res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Categories found',
        data: [...data],
    });
};

module.exports = { getCategories };