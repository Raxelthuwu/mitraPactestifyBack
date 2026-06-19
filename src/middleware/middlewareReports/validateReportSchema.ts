import type { Request, Response, NextFunction } from 'express';
import { createReportSchema } from '../../schemas/reportsSchemas/reportSchema.js';

export const validateCreateReportSchema = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log('[validateCreateReportSchema] Input:', req.body);

  const { error, value } = createReportSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    console.error('[validateCreateReportSchema] Validation error:', error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    })));
    res.status(400).json({ status: 400 });
    return;
  }

  req.body = value;
  console.log('[validateCreateReportSchema] Validation success:', value);
  next();
};