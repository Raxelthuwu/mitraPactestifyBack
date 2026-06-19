import jwt, { type JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'];

if (!JWT_SECRET) {
  console.error('[JWT] Missing JWT_SECRET environment variable');
  throw new Error('JWT_SECRET is not configured');
}

if (!JWT_EXPIRES_IN) {
  console.error('[JWT] Missing JWT_EXPIRES_IN environment variable');
  throw new Error('JWT_EXPIRES_IN is not configured');
}

const secret: Secret = JWT_SECRET;



export interface TokenPayload {
  id_user: number;
  name: string;
  role: string;
  exp?: number;
}


export const generateToken = (payload: TokenPayload): string => {
  console.log('[JWT.generateToken] Input:', payload);

  const token = jwt.sign(payload, secret, {
    expiresIn: JWT_EXPIRES_IN,
  });

  console.log('[JWT.generateToken] Token generated successfully');
  console.log('[JWT.generateToken] Return:', '[TOKEN]');

  return token;
};


export const verifyToken = (token: string): TokenPayload => {
  console.log('[JWT.verifyToken] Input:', {
    token: token ? '[PROVIDED]' : '[MISSING]',
  });

  const decoded = jwt.verify(token, secret) as JwtPayload & TokenPayload;

  const payload: TokenPayload = {
    id_user: decoded.id_user,
    name: decoded.name,
    role: decoded.role,
    ...(decoded.exp !== undefined && { exp: decoded.exp }),
  };

  console.log('[JWT.verifyToken] Token verified successfully');
  console.log('[JWT.verifyToken] Return:', payload);

  return payload;
};