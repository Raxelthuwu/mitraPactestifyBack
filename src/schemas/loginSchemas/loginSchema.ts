import Joi from 'joi';

console.log('[loginSchema] Loading login validation schema');

export const loginSchema = Joi.object({
  correo: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .max(150)
    .required(),

  cedula: Joi.number()
    .integer()
    .positive()
    .max(Number.MAX_SAFE_INTEGER)
    .required(),

  password: Joi.string()
    .min(1)
    .max(255)
    .required(),
}).unknown(false);

console.log('[loginSchema] Schema loaded successfully');