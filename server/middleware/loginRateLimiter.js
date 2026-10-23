const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
    default: false
  },
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

module.exports = loginRateLimiter;
