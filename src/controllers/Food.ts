import { NextFunction, Request, Response } from 'express';
import { FoodEntity } from 'entities/Food';
import prisma from '../utils/db.server';

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

  getList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const foodList = await prisma.food.findMany();

      res.status(200);
      res.json({
        foodList: foodList.map((food: any) =>
          this._mapDocToFoodEntity(food)
        ),
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
      const { foodId } = req.params;

      const food = await prisma.food.findUnique({
        where: {
          foodId: parseInt(foodId, 10),
        },
      });

      res.status(200);
      res.json({
        food: this._mapDocToFoodEntity(food)
      });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(new Error(err.message));
    }
  };
}

export default new FoodController();
