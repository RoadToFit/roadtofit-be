import { NextFunction, Request, Response } from 'express';
import { FoodEntity } from 'entities/Food';
import prisma from '../utils/db.server';
import csvParser from '../utils/csvParser';

class FoodController {
  private _mapDocToFoodEntity = (doc: any): FoodEntity => ({
    foodId: doc.foodId,
    name: doc.name,
    calories: doc.calories,
    proteins: doc.proteins,
    fat: doc.fat,
    carbohydrate: doc.carbohydrate,
    image: doc.image,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  });

  /**
   * @openapi
   * components:
   *  schemas:
   *    GetFoodListResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - foodList
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        foodList:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/FoodEntity'
   */
  getList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const foodList = await prisma.food.findMany();

      res.status(200);
      res.json({
        success: true,
        message: 'OK',
        foodList: foodList.map((food: any) =>
          this._mapDocToFoodEntity(food)
        ),
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
   *    GetFoodByIdResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - food
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        food:
   *          $ref: '#/components/schemas/FoodEntity'
   */
  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { foodId } = req.params;

      const food = await prisma.food.findUnique({
        where: {
          foodId: parseInt(foodId, 10),
        },
      });
      
      if (!food) {
        res.status(404);
        res.json({
          success: false,
          message: 'Food not found',
        });

        return next();
      }

      res.status(200);
      res.json({
        success: true,
        message: 'OK',
        food: this._mapDocToFoodEntity(food)
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
   *    GenerateFoodFromFileResponse:
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
   *          default: Foods sucessfully generated
   */
  generateFoodFromFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const foodHeader = ['foodId', 'calories', 'proteins', 'fat', 'carbohydrate', 'name', 'image'];
      const rows = await csvParser('./src/data/nutrition.csv', foodHeader);

      const idToCheck: number[] = rows.map(row => row.foodId);
      await prisma.food.deleteMany({
        where: {
          foodId: {
            in: idToCheck
          }
        },
      });

      await prisma.food.createMany({
        data: rows,
      });

      res.status(200);
      res.json({
        success: true,
        message: 'Foods sucessfully generated',
      });

      return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };
}

export default new FoodController();
