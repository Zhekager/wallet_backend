const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
    {
        name: { type: String },
        color: { type: String },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: false,
            transform: function (doc, ret) {
                delete ret._id;
                return ret;
            },
        },
    },
);

const Category = model('category', categorySchema);

module.exports = Category;