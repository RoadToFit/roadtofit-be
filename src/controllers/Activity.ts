import { NextFunction, Request, Response } from 'express';
import { ActivityEntity } from 'entities/Activity';
import prisma from '../utils/db.server';

class ActivityController {
  private _mapDocToActivityEntity = (doc: any): ActivityEntity => ({
    activityId: doc.activityId,
    activity: doc.activity,
    category: doc.category,
    calPerHour: doc.calPerHour,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  });

  getList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const activityList = await prisma.activity.findMany();

      res.status(200);
      res.json({
        activityList: activityList.map((activity: any) =>
          this._mapDocToActivityEntity(activity)
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
      const { activityId } = req.params;

      const activity = await prisma.activity.findUnique({
        where: {
          activityId: parseInt(activityId, 10),
        },
      });

      res.status(200);
      res.json({
        activity: this._mapDocToActivityEntity(activity)
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

export default new ActivityController();
