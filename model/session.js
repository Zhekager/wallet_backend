const { Schema, model } = require("mongoose");

// const sessionSchema = new Schema({
//   _id: {
//     type: Schema.Types.ObjectId,
//     required: true,
//   },
// });

const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Session = model("session", sessionSchema);
module.exports = Session;
