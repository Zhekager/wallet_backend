const rateLimit = require("express-rate-limit");
const { HttpCode, LimiterParameters } = require("./constants");

const limiter = rateLimit({
  windowMs: LimiterParameters.TIME,
  max: LimiterParameters.MAX_ATTEMPT_NUMBER,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.TOO_MANY_REQUESTS).json({
      status: "error",
      code: HttpCode.TOO_MANY_REQUESTS,
      message: "Too many requests, please try again later",
    });
  },
});

module.exports = limiter;
