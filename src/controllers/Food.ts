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
        message: '',
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
        success: true,
        message: '',
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
        message: '',
        rows,
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
