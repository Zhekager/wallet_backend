const { Schema, SchemaTypes, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new Schema(
  {
    isExpense: {
      type: Boolean,
      default: true
    },
    date: {
      type: Date,

    },
    month: {
      type: Number,
    },
    year: {
      type: Number,
    },
    sum: {
      type: Number,
      required: true,
      //set: (data) => parseInt(data),
    },
    category: {
      type: SchemaTypes.ObjectId,
      ref: 'category',
    },
    balance: {
      type: Number,
    },
    comment: {
      type: String,
      maxlength: 50,
      default: '',
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
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
    toObject: {
      virtuals: true,
    },
  },
);

transactionSchema.virtual('type').get(function () {
  return this.isExpense ? '-' : '+';
});

transactionSchema.virtual('date_str').get(function () {
  const dd = this.date.getDate();
  const mm = this.date.getMonth() + 1;
  const yyyy = this.date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
});

transactionSchema.plugin(mongoosePaginate);

const Transaction = model('transaction', transactionSchema);
// transactionSchema.virtual('info').get(function () {
//     return `This is transaction ${this.owner}`
// })
module.exports = Transaction;