import { aj, logger } from '#config';
import { slidingWindow } from '@arcjet/node';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest'; // Default to 'guest' if no user is authenticated
    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message =
          'Admin request limit exceeded (20 requests per minute). Slow down.';
        break;
      case 'user':
        limit = 10;
        message =
          'User request limit exceeded (10 requests per minute). Slow down.';
        break;
      case 'guest':
      default:
        limit = 5;
        message =
          'Guest request limit exceeded (5 requests per minute). Slow down.';
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied) {
      if (decision.reason.isBot()) {
        logger.warn('Bot request blocked:', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
        });

        return res.status(403).json({
          error: 'Forbidden',
          message: 'Automated requests are not allowed.',
        });
      }

      if (decision.reason.isShield()) {
        logger.warn('Shield request blocked:', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
          method: req.method,
        });

        return res.status(403).json({
          error: 'Forbidden',
          message: 'Request blocked by security policy.',
        });
      }
      if (decision.reason.isRateLimit()) {
        logger.warn('Rate limit exceeded:', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
          method: req.method,
        });

        return res.status(429).json({
          error: 'Too Many Requests',
          message,
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error in security middleware:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong in the security middleware.',
    });
  }
};

export default securityMiddleware;
