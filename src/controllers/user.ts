import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import prisma from '../utils/db.server';

/**
 * @openapi
 * components:
 *  schemas:
 *    UserEntity:
 *      type: object
 *      required:
 *        - userId
 *        - username
 *        - name
 *        - gender
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        userId:
 *          type: string
 *        username:
 *          type: string
 *        name:
 *          type: string
 *        gender:
 *          type: string
 *        age:
 *          type: number
 *          nullable: true
 *        weight:
 *          type: number
 *          nullable: true
 *        height:
 *          type: number
 *          nullable: true
 *        imageUrl:
 *          type: string
 *          nullable: true
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
type UserEntity = {
  userId: string;
  username: string;
  name: string;
  gender: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

class UserController {
  private _mapDocToUserEntity = (doc: any): UserEntity => ({
    userId: doc.userId,
    username: doc.username,
    name: doc.name,
    age: doc.age,
    gender: doc.gender,
    weight: doc.weight,
    height: doc.height,
    imageUrl: doc.imageUrl,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  });

  /**
   * @openapi
   * components:
   *  schemas:
   *    RegisterRequest:
   *      type: object
   *      required:
   *        - username
   *        - password
   *        - name
   *        - gender
   *      properties:
   *        username:
   *          type: string
   *          default: username
   *        password:
   *          type: password
   *          default: password
   *        name:
   *          type: string
   *          default: John Doe
   *        gender:
   *          type: string
   *          default: MALE
   */
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password, name, gender } = req.body;

      if (
        username === undefined ||
        password === undefined ||
        name === undefined ||
        gender === undefined
      ) {
        res.status(400);
        res.json({ message: 'Invalid request body' });
        throw new Error('Invalid request body');
      }

      const data = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (data) {
        res.status(404);
        res.json({ message: 'Username already exist' });
        throw new Error('Username already exist');
      }

      const hashed = await hash(password, 10);

      await prisma.user.create({
        data: {
          username,
          password: hashed,
          name,
          gender,
        },
      });

      res.status(200);
      res.json({ message: 'User sucessfully created' });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    LoginRequest:
   *      type: object
   *      required:
   *        - username
   *        - password
   *      properties:
   *        username:
   *          type: string
   *          default: username
   *        password:
   *          type: password
   *          default: password
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (username === undefined || password === undefined) {
        res.status(400);
        res.json({ message: 'Invalid request body' });
        throw new Error('Invalid request body');
      }

      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        res.status(404);
        res.json({ message: 'Username does not exist' });
        throw new Error('Username does not exist');
      }

      const valid = await compare(password, user.password);

      if (!valid) {
        res.status(401);
        res.json({ message: 'Incorrect password' });
        throw new Error('Incorrect password');
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
