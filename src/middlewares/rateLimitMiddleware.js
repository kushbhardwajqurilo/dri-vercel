const { default: rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: "too many requests, please try again after 10 minutes",
});
module.exports = limiter;
