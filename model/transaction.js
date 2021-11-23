const { Schema, SchemaTypes, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new Schema(
  {
    date: {
      type: String,
      default: new Date().toLocaleDateString(),
    },
    type: {
      type: String,
      enum: ['-', '+'],
      default: '+',
    },
    category: {
      type: SchemaTypes.ObjectId,
      ref: 'category',
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
      default: new Date().toLocaleDateString().slice(4, 6),
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