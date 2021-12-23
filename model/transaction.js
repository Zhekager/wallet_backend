const { Schema, SchemaTypes, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Category } = require('../helpers/constants');

const transactionSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      //default: new Date().toLocaleDateString(),
    },
    type: {
      type: String,
      enum: ['-', '+'],
      default: '+',
    },
    category: {
      type: SchemaTypes.String,
      enum: [...Category.spend, ...Category.income],
      required: true,
    },
    money: {
      type: Number,
      min: 0,
      required: [true],
    },
    balance: {
      type: Number
    },
    month: {
      type: String,
      default: new Date().toLocaleDateString().slice(3,5),
    },
    year: {
      type: String,
      default: new Date().toLocaleDateString().slice(6),
    },
    comment: {
      type: String,
      default: '',
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

transactionSchema.plugin(mongoosePaginate);

const Transaction = model('transaction', transactionSchema);

module.exports = Transaction;