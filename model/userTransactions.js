const { Schema, model, SchemaTypes } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const TransactionsUserSchema = new Schema(
    {
        userTransactions: [{ type: SchemaTypes.ObjectId, ref: "transactions" }],
        totalBalance: {
            type: Number,
        },
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

TransactionsUserSchema.plugin(mongoosePaginate);

const UserTransactions = model("transactionsUser", TransactionsUserSchema);

module.exports = UserTransactions;