const Categories = require("../repository/categories");
const { HttpCode } = require("../helpers/constants");

const getCategories = async (req, res) => {
  
=================================================================================
  
    const userId = req.user?._id;
    const result = await Categories.getCategories(userId);
    return res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Categories found',
        result
    });

  ///////////////////////////////////////////////////////////////////////////
  
  // const userId = req.user?._id;                          <=конфлікт
//   const userId = req.user && req.user._id;

//   const data = await Categories.listCategories(userId, req.query);
//   res.json({
//     status: "Success",
//     code: HttpCode.OK,
//     message: "Categories found",
//     data: data,
//   });
 ==================================================================================

};

const addCategories = async ({ body }, res) => {
    const result = await Categories.addCategories(body);

    return res.json({
        status: 'Created',
        code: HttpCode.CREATED,
        data: {
            result,
        },
    });
};

module.exports = { getCategories, addCategories };
