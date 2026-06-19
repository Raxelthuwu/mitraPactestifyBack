import Joi from 'joi';

export const createReportSchema = Joi.object({
  Reporte: Joi.string().trim().min(1).max(1000).required(),
  Mesa: Joi.number().integer().min(1).required(),
  Problem_Grade: Joi.number().integer().min(1).max(3).required(),
});