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
    foodRecommendations: doc.foodRecommendations
      ? doc.foodRecommendations.map((f: any) => ({...f.food}))
      : [],
    activityRecommendations: doc.activityRecommendations
      ? doc.activityRecommendations.map((f: any) => ({...f.activity}))
      : [],
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
   *          enum: [MALE, FEMALE]
   *    RegisterResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: User sucessfully created
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
        res.json({ 
          success: false,
          message: 'Username already exist'
        });
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
      res.json({
        success: true,
        message: 'User sucessfully created',
      });

      return next();
    } catch (err: any) {
      res.status(500);
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
   *        - success
   *        - message
   *        - user
   *        - token
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: Login success
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
        res.json({
          status: false,
          message: 'Wrong credentials',
        });
        throw new Error('Wrong credentials');
      }

      const valid = await compare(password, user.password);

      if (!valid) {
        res.status(401);
        res.json({
          status: false,
          message: 'Wrong credentials',
        });
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
        success: true,
        message: 'Login success',
        user: this._mapDocToUserEntity(user),
        token,
      });

      return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    GetUserListResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - userList
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        userList:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/UserEntity'
   */
  getList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userList = await prisma.user.findMany({
        include: {
          foodRecommendations: {
            include: {
              food: true,
            },
          },
          activityRecommendations: {
            include: {
              activity: true,
            },
          },
        },   
      });

      res.status(200);
      res.json({
        success: true,
        message: 'OK',
        userList: userList.map((user: any) => this._mapDocToUserEntity(user)),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    GetUserByIdResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - user
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        user:
   *          $ref: '#/components/schemas/UserEntity'
   */
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
          foodRecommendations: {
            include: {
              food: true,
            },
          },
          activityRecommendations: {
            include: {
              activity: true,
            },
          },
        },   
      });

      if (!user) {
        res.status(404);
        res.json({
          success: false,
          message: 'User not found',
        });

        return next();
      }

      res.status(200);
      res.json({
        success: true,
        message: '',
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    UpdateUserByIdRequest:
   *      type: object
   *      properties:
   *        name:
   *          type: string
   *          default: name
   *        age:
   *          type: number
   *          default: 15
   *        bodyType:
   *          type: number
   *          enum: [ECTOMORPH, MESOMORPH, ENDOMORPH]
   *    UpdateUserByIdResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - user
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        user:
   *          $ref: '#/components/schemas/UserEntity'
   */
  updateById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, name, age, bodyType } = req.body;

      const user = await prisma.user.update({
        where: {
          userId,
        },
        data: {
          name,
          age,
          bodyType,
        },
        include: {
          foodRecommendations: {
            include: {
              food: true,
            },
          },
          activityRecommendations: {
            include: {
              activity: true,
            },
          },
        },   
      });

      res.status(200);
      res.json({
        success: true,
        message: 'OK',
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    UpdateUserRecommendationByIdRequest:
   *      type: object
   *      required:
   *        - bmi
   *        - foodRecommendations
   *        - activityRecommendations
   *      properties:
   *        bmi:
   *          type: number
   *        foodRecommendations:
   *          type: array
   *          items:
   *            type: number
   *        activityRecommendations:
   *          type: array
   *          items:
   *            type: number
   *    UpdateUserRecommendationByIdResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - user
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        user:
   *          $ref: '#/components/schemas/UserEntity'
   */
  updateRecommendationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, bmi, foodRecommendations, activityRecommendations } = req.body;

      // Delete all previous recommendations
      await prisma.userFoodRecommendations.deleteMany({
        where: {
          userId,
        }
      })

      await prisma.userActivityRecommendations.deleteMany({
        where: {
          userId,
        }
      })

      const user = await prisma.user.update({
        where: {
          userId,
        },
        data: {
          bmi,
          foodRecommendations: {
            create: foodRecommendations.map((id: number) => ({
              food: { 
                connect: { foodId: id }
              }
            }))
          },
          activityRecommendations: {
            create: activityRecommendations.map((id: number) => ({
              activity: { 
                connect: { activityId: id }
              }
            }))
          }
        },
        include: {
          foodRecommendations: {
            include: {
              food: true,
            },
          },
          activityRecommendations: {
            include: {
              activity: true,
            },
          },
        },    
      });

      res.status(200);
      res.json({
        success: true,
        message: 'OK',
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    UpdateUserImageByIdRequest:
   *      type: object
   *      required:
   *        - file
   *      properties:
   *        file:
   *          type: string
   *          format: binary
   *    UpdateUserImageByIdResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - user
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        user:
   *          $ref: '#/components/schemas/UserEntity'
   */
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
          foodRecommendations: {
            include: {
              food: true,
            },
          },
          activityRecommendations: {
            include: {
              activity: true,
            },
          },
        },   
      });

      res.status(200);
      res.json({
        success: true,
        message: 'OK',
        user: this._mapDocToUserEntity(user),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };

  /**
   * @openapi
   * components:
   *  schemas:
   *    DeleteUserByIdResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: User sucessfully deleted
   */
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
          foodRecommendations: {
            include: {
              food: true,
            },
          },
          activityRecommendations: {
            include: {
              activity: true,
            },
          },
        },   
      });

      if (!user) {
        res.status(404);
        res.json({
          success: false,
          message: 'User not found',
        });

        return next();
      }

      res.status(200);
      res.json({
        success: true,
        message: 'User sucessfully deleted',
      });

      return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };
}

export default new UserController();
