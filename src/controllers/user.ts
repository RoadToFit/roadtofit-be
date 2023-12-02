import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import prisma from '../utils/db.server';

type UserEntity = {
  userId: string;
  username: string;
  name: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  imageUrl: string | null;
};

class UserController {
  private _mapDocToUserEntity = (doc: any): UserEntity => ({
    userId: doc.userId,
    username: doc.username,
    name: doc.name,
    age: doc.age,
    weight: doc.weight,
    height: doc.height,
    imageUrl: doc.imageUrl,
  });

  // TODO: Set username, password (encrypted), and name
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password, name } = req.body;

      if (
        username === undefined ||
        password === undefined ||
        name === undefined
      ) {
        throw new Error('Invalid request.');
      }

      const data = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (data) {
        throw new Error('Username already exist.');
      }

      // TODO: move salt hash to ENV
      const hashed = await hash(password, 10);

      await prisma.user.create({
        data: {
          username,
          password: hashed,
          name,
        },
      });

      res.status(200);
      res.send('User sucessfully created.');

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  // TODO:
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (username === undefined || password === undefined) {
        throw new Error('Invalid request.');
      }

      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        throw new Error('Username does not exist.');
      }

      const valid = await compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password.');
      }

      const payload = {
        userId: user.userId,
        username: user.username,
      };

      // TODO: set secret to ENV
      const token = sign(payload, 'ini secret', {
        expiresIn: '1h',
      });

      res.status(200);
      res.json({
        user: this._mapDocToUserEntity(user),
        token,
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  getUserList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userList = await prisma.user.findMany();

      res.status(200);
      res.send({
        userList: userList.map((user: any) => this._mapDocToUserEntity(user)),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const parsedUserId = parseInt(userId, 10);

      if (userId === undefined || Number.isNaN(parsedUserId)) {
        throw new Error('Invalid request.');
      }

      const user = await prisma.user.findUnique({
        where: {
          userId: parsedUserId,
        },
      });

      if (!user) {
        res.status(204);
        res.send();

        return next();
      }

      res.status(200);
      res.send({
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  updateUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, age, weight, height } = req.body;

      const parsedUserId = parseInt(userId, 10);

      if (
        userId === undefined ||
        Number.isNaN(parsedUserId) ||
        age === undefined ||
        weight === undefined ||
        height === undefined
      ) {
        throw new Error('Invalid request.');
      }

      const user = await prisma.user.update({
        where: {
          userId: parsedUserId,
        },
        data: {
          age,
          weight,
          height,
        },
      });

      res.status(200);
      res.send({
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  // TODO:
  updateUserImageById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const parsedUserId = parseInt(userId, 10);

      if (userId === undefined || Number.isNaN(parsedUserId)) {
        throw new Error('Invalid request.');
      }

      // TODO: Upload and get URL
      const imageUrl = '';

      const user = await prisma.user.update({
        where: {
          userId: parsedUserId,
        },
        data: {
          imageUrl,
        },
      });

      res.status(200);
      res.send({
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  deleteUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const parsedUserId = parseInt(userId, 10);

      if (userId === undefined || Number.isNaN(parsedUserId)) {
        throw new Error('Invalid request.');
      }

      const user = await prisma.user.delete({
        where: {
          userId: parsedUserId,
        },
      });

      if (!user) {
        res.status(204);
        res.send();

        return next();
      }

      res.status(200);
      res.send('User successfully deleted.');

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };
}

export default new UserController();
