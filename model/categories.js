const { Schema, model, SchemaTypes } = require('mongoose');

const categorySchema = new Schema(
    {
        name: { type: String },
        color: { type: String },
        isExpense: { type: Boolean, default: true },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                return ret;
            },
        },
    },
);

const Category = model('category', categorySchema);

module.exports = Category;