// const path = require("path");

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const boolParser = require("express-query-boolean");
const helmet = require("helmet");
require("dotenv").config();
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
//const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
const { HttpCode } = require("./helpers/constants");

const usersRouter = require("./routes/api/users");

const categoriesRouter = require("./routes/api/categories");
const transactionsRouter = require("./routes/api/transactions");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
//test
//app.use(express.static(AVATAR_OF_USERS));
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(boolParser());

app.use((req, _res, next) => {
  app.set("lang", req.acceptsLanguages(["en", "ru"]));
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/users", usersRouter);

// app.use("/link", (_req, res) => {
//   res.sendFile(path.join(__dirname, "./public/link.html"));
// });

app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
});

module.exports = app;
