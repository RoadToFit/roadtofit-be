import { NextFunction, Request, Response } from 'express';

class UserController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200);
      res.send('Sample response');

      return next();
    } catch (err) {
      res.status(500);
      res.send('Something went wrong');

      return next();
    }
  };
}

export default new UserController();
