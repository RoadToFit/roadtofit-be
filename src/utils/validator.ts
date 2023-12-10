import Joi from 'joi';
import type { NextFunction, Request, Response } from 'express';

const validator = (schema: Joi.ObjectSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validateAsync(req)
      .catch((err) => {
        throw err;
      });
    
    return next();
  } catch (err: any) {
    res.status(400);
    res.json({ message: err.message });

    throw new Error(err.message);
  }
};

export default validator;