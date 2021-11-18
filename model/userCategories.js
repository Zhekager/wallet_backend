const { Schema, model, SchemaTypes } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserCategorySchema = new Schema(
    {
        userCategory: [{ type: SchemaTypes.ObjectId, ref: "categories" }],
        owner: {
            type: SchemaTypes.ObjectId,
            ref: "user",
        },
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
    }
);

UserCategorySchema.plugin(mongoosePaginate);

const UserCategories = model("userCategories", UserCategorySchema);

module.exports = UserCategories;