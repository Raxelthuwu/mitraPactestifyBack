import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type TokenPayload } from '../utils/jwt.js';
import { logouthModel } from '../models/loginModels/logoutModel.js';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

const logoutModel = new logouthModel();

export const authJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const tokenRevoked = await logoutModel.isTokenRevoked(token);

    console.log('[authJWT] Token revoked status:', tokenRevoked);

    if (tokenRevoked) {
      console.error('[authJWT] Token is revoked');

      res.status(401).json({
        status: 401,
        message: 'Unauthorized',
      });

      return;
    }

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