import { NextFunction, Request, Response } from 'express';
import { ActivityEntity } from 'entities/Activity';
import prisma from '../utils/db.server';
// import csvParser from 'utils/csvParser';

class ActivityController {
  private _mapDocToActivityEntity = (doc: any): ActivityEntity => ({
    activityId: doc.activityId,
    activity: doc.activity,
    category: doc.category,
    calPerHour: doc.calPerHour,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  });

  /**
   * @openapi
   * components:
   *  schemas:
   *    GetActivityListResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - activityList
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        activityList:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/ActivityEntity'
   */
  getList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const activityList = await prisma.activity.findMany();

      res.status(200);
      res.json({
        success: true,
        message: 'OK',
        activityList: activityList.map((activity: any) =>
          this._mapDocToActivityEntity(activity)
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
   *    GetActivityByIdResponse:
   *      type: object
   *      required:
   *        - success
   *        - message
   *        - activity
   *      properties:
   *        success:
   *          type: boolean
   *          default: true
   *        message:
   *          type: string
   *          default: OK
   *        activity:
   *          $ref: '#/components/schemas/ActivityEntity'
   */
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
        success: true,
        message: 'OK',
        activity: this._mapDocToActivityEntity(activity)
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
   *    GenerateActivityFromFileResponse:
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
   *          default: Activities sucessfully generated
   */
  generateActivityFromFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // TODO:
      throw new Error('Method not implemented')
      // const activityHeader = ['activityId', 'activity', 'category', 'calPerHour'];
      // const rows = await csvParser('./src/data/activity.csv', activityHeader);

      // const idToCheck: number[] = rows.map(row => row.activityId);
      // await prisma.activity.deleteMany({
      //   where: {
      //     activityId: {
      //       in: idToCheck
      //     }
      //   },
      // });

      // await prisma.activity.createMany({
      //   data: rows,
      // });

      // res.status(200);
      // res.json({
      //   success: true,
      //   message: 'Activities sucessfully generated',
      // });

      // return next();
    } catch (err: any) {
      res.status(500);
      console.log(err.message);

      return next(new Error(err.message));
    }
  };
};

export default new ActivityController();
