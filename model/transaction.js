const { Schema, SchemaTypes, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const transactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["+", "-"],
      require: true,
    },
    date: {
      type: String,
      required: true,
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
      set: (data) => parseInt(data),
    },
    categoryId: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
    },
    comment: {
      type: String,
      maxlength: 50,
      default: "",
    },
    owner: {
      type: SchemaTypes.ObjectId,
      required: true,
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
    toObject: {
      virtuals: true,
    },
  }
);

transactionSchema.plugin(mongoosePaginate);

const Transaction = model("transaction", transactionSchema);
// transactionSchema.virtual('info').get(function () {
//     return `This is transaction ${this.owner}`
// })
module.exports = Transaction;
