import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
    const result = schema.safeParse(data);
    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    if (source === 'body') req.body = result.data;
    else if (source === 'query') req.query = result.data as never;
    next();
  };