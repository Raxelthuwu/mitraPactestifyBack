import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type TokenPayload } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log('[authJWT] Authorization header:', req.headers.authorization ? '[PROVIDED]' : '[MISSING]');

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error('[authJWT] Missing Authorization header');

    res.status(401).json({
      status: 401,
      message: 'Unauthorized',
    });

    return;
  }

  const [scheme, token] = authHeader.split(' ');

  console.log('[authJWT] Authorization scheme:', scheme);

  if (scheme !== 'Bearer' || !token) {
    console.error('[authJWT] Invalid Authorization header format');

    res.status(401).json({
      status: 401,
      message: 'Unauthorized',
    });

    return;
  }

  try {
    const decoded = verifyToken(token);

    req.user = decoded;

    console.log('[authJWT] Token verified successfully');
    console.log('[authJWT] Authenticated user:', decoded);

    next();
  } catch (error) {
    console.error('[authJWT] Token verification error:', error);

    res.status(401).json({
      status: 401,
      message: 'Unauthorized',
    });
  }
};