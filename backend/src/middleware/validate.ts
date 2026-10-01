import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

export const validate = (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(Object.assign(new Error('Request validation failed'), {
      statusCode: 400,
      details: result.error.flatten(),
    }));
  }
  req.body = result.data;
  next();
};

export const validateParams = (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return next(Object.assign(new Error('Request parameters are invalid'), { statusCode: 400, details: result.error.flatten() }));
  }
  next();
};