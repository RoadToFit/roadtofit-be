import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

interface JWTAuthPayload extends JwtPayload {
  userId: string;
  username: string;
}

class Middleware {
  auth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = header.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // TODO: move secret to ENV
    // eslint-disable-next-line consistent-return
    verify(token, 'ini secret', (error, user) => {
      try {
        const { userId } = user as JWTAuthPayload;
        if (!error) {
          Object.assign(req.body, { userId });
          return next();
        }
      } catch (e) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    });

    return null;
  };
}

export default new Middleware();
