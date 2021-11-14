const { Schema, SchemaTypes, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new Schema(
    {
        transType: {
            type: String,
            enum: ['spend', 'income'],
            default: 'spend',
            required: true,
        },

        date: {
            type: Date,
            min: '2020-01-01',
            required: true,
            },
        
        month: {
            type: Number,
            required: true,
        },

        year: {
            type: Number,
            required: true,
        },

        sum: {
            type: Number,
            required: [true, 'Укажите сумму транзакции'],
        },

        balance: {
            type: Number,
            required: true,
            },
        
        comment: {
            type: String,
            maxlength: 250,
            default: null,
            },
        
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'categories',
            required: true,
        },
        
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id
                return ret
            },
        },
    },
);

transactionSchema.plugin(mongoosePaginate);

const Transaction = model('transaction', transactionSchema);

module.exports = Transaction;