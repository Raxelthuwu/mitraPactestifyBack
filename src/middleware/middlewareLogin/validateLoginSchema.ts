import type { Request, Response, NextFunction } from 'express';
import { loginSchema } from '../../schemas/loginSchemas/loginSchema.js';

export const validateLoginSchema = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log('[validateLoginSchema] Input:', {
    correo: req.body?.correo,
    cedula: req.body?.cedula,
    password: req.body?.password ? '[PROVIDED]' : '[MISSING]',
  });

  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    console.error('[validateLoginSchema] Validation error:', error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    })));

    res.status(400).json({
      status: 400,
      inicio: false,
      message: 'Invalid login data',
    });

    return;
  }

  req.body = value;

  console.log('[validateLoginSchema] Validation success:', {
    correo: value.correo,
    cedula: value.cedula,
    password: value.password ? '[PROVIDED]' : '[MISSING]',
  });

  next();
};