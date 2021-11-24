const mongoose = require("mongoose");
require("dotenv").config();

let uri;

if (process.env.NODE_ENV === "test") {
  uri = process.env.URI_DB_TEST;
} else {
  uri = process.env.URI_DB;
}

const db = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  // poolSize: 5,
});

if (process.env.NODE_ENV === "test") {
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connection to DB");
  });

  mongoose.connection.on("error", (error) => {
    console.log(`Database connection error: ${error.message}`);
  });
}

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Database connection closed and app termination");
  process.exit();
});

module.exports = db;
