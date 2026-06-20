import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again later',
  },
  handler: (req, res) => {
    console.error('[globalRateLimiter] Request blocked:', {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
    });

    res.status(429).json({
      status: 429,
      message: 'Too many requests, please try again later',
    });
  },
});