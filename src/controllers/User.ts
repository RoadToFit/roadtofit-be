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
    bodyType: doc.bodyType,
    bmi: doc.bmi,
    foodRecommendations: doc.foodRecommendations || [],
    activityRecommendations: doc.activityRecommendations || [],
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

      return next(new Error(err.message));
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

      return next(new Error(err.message));
    }
  };

  getList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userList = await prisma.user.findMany({
        include: {
          foodRecommendations: true,
          activityRecommendations: true,
        },
      });

      res.status(200);
      res.json({
        userList: userList.map((user: any) => this._mapDocToUserEntity(user)),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(new Error(err.message));
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
        include: {
          foodRecommendations: true,
          activityRecommendations: true,
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

      return next(new Error(err.message));
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
   */
  updateById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, name, age } = req.body;

      const user = await prisma.user.update({
        where: {
          userId,
        },
        data: {
          name,
          age,
        },
        include: {
          foodRecommendations: true,
          activityRecommendations: true,
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

      return next(new Error(err.message));
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    UpdateRecommendationByIdRequest:
   *      type: object
   *      properties:
   *        foodRecommendations:
   *          type: array
   *          items:
   *            type: number
   *        activityRecommendations:
   *          type: array
   *          items:
   *            type: number
   */
  updateRecommendationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, foodRecommendations, activityRecommendations } = req.body;

      const user = await prisma.user.update({
        where: {
          userId,
        },
        data: {
          foodRecommendations: {
            connect: foodRecommendations.map((id: number) => ({
              userId_foodId: { userId, foodId: id }
            }))
          },
          activityRecommendations: {
            connect: activityRecommendations.map((id: number) => ({
              userId_activityId: { userId, activityId: id }
            }))
          }
        },
        include: {
          foodRecommendations: true,
          activityRecommendations: true,
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

      return next(new Error(err.message));
    }
  };

  updateImageById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      if (!req.file) {
        res.status(400)
        res.send({ message: "No image uploaded" });

        return next();
      }

      const user = await prisma.user.update({
        where: {
          userId,
        },
        data: {
          imageUrl: `https://storage.googleapis.com/roadtofit-bucket/${req.file.path}`,
        },
        include: {
          foodRecommendations: true,
          activityRecommendations: true,
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

      return next(new Error(err.message));
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
        include: {
          foodRecommendations: true,
          activityRecommendations: true,
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

      return next(new Error(err.message));
    }
  };
}

export default new UserController();
