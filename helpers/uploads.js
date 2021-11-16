const multer = require("multer");
require("dotenv").config();
const { CustomError } = require("./customError");
const { HttpCode, LimitFieldSize } = require("./constants");
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now().toString()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: LimitFieldSize },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.includes("image")) {
      return cb(null, true);
    }

    cb(new CustomError(HttpCode.BAD_REQUEST, "A wrong format for avatar"));
  },
});

module.exports = upload;
