const { Schema } = require('mongoose');

const categorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: [true, 'Укажите название категории'],
        },
    },
    { versionKey: false, timestamps: true },
);

const Category = model('category', categorySchema);

module.exports = Category;