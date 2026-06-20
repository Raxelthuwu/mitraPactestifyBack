import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    inicio: false,
    message: 'Too many login attempts, please try again later',
  },
  handler: (req, res) => {
    console.error('[loginRateLimiter] Login request blocked:', {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
    });

    res.status(429).json({
      status: 429,
      inicio: false,
      message: 'Too many login attempts, please try again later',
    });
  },
});