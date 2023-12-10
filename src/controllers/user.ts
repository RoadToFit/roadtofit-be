import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { UserEntity } from '../entities/User';
// import * as StorageController from "./Storage";
import prisma from '../utils/db.server';

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

      return next(err);
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
   *    LoginResponse:
   *      type: object
   *      required:
   *        - user
   *        - token
   *      properties:
   *        user:
   *          $ref: '#/components/schemas/UserEntity'
   *        token:
   *          type: string
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        res.status(404);
        res.json({ message: 'Wrong credentials' });
        throw new Error('Wrong credentials');
      }

      const valid = await compare(password, user.password);

      if (!valid) {
        res.status(401);
        res.json({ message: 'Wrong credentials' });
        throw new Error('Wrong credentials');
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

      return next(err);
    }
  };

  getList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userList = await prisma.user.findMany();

      res.status(200);
      res.json({
        userList: userList.map((user: any) => this._mapDocToUserEntity(user)),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(err);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          userId,
        },
      });

      if (!user) {
        res.status(204);
        res.send();

        return next();
      }

      res.status(200);
      res.json({
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(err);
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    UpdateByIdRequest:
   *      type: object
   *      properties:
   *        name:
   *          type: string
   *          default: name
   *        age:
   *          type: number
   *          default: 15
   *        weight:
   *          type: number
   *          default: 150
   *        height:
   *          type: number
   *          default: 50
   */
  updateById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, name, age, weight, height } = req.body;

      const user = await prisma.user.update({
        where: {
          userId,
        },
        data: {
          name,
          age,
          weight,
          height,
        },
      });

      res.status(200);
      res.json({
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(err);
    }
  };

  // TODO:
  updateImageById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      /*
      const { userId } = req.body;

      if (!req.file) {
        res.status(400)
        res.send({ message: "Please upload a file!" });

        return next();
      }

      const blob = StorageController.bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err: any) => {
        res.status(500)
        res.send({ message: err.message });

        return next();
      })

      // eslint-disable-next-line consistent-return
      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${StorageController.bucket.name}/${blob.name}`;

        try {
          await StorageController.bucket.file(req.file!.originalname).makePublic();
        } catch {
          res.status(500)
          res.send({ message: `Public access denied of ${publicUrl}` });

          return next();
        }

        const user = await prisma.user.update({
          where: {
            userId,
          },
          data: {
            imageUrl: publicUrl,
          },
        });

        res.status(200);
        res.json({
          user: this._mapDocToUserEntity(user),
        });
      })

      blobStream.end(req.file.buffer);
      */

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(err);
    }
  };

  deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      const user = await prisma.user.delete({
        where: {
          userId,
        },
      });

      if (!user) {
        res.status(204);
        res.send();

        return next();
      }

      res.status(200);
      res.json({ message: 'User sucessfully deleted' });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(err);
    }
  };
}

export default new UserController();
