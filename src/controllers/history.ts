import { NextFunction, Request, Response } from 'express';
import { HistoryEntity } from 'entities/History';
import prisma from '../utils/db.server';

class HistoryController {
  private _mapDocToHistoryEntity = (doc: any): HistoryEntity => ({
    historyId: doc.historyId,
    userId: doc.userId,
    historyType: doc.historyType,
    result: doc.result,
    description: doc.description,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  });

  getList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const historyList = await prisma.history.findMany();

      res.status(200);
      res.json({
        historyList: historyList.map((history: any) =>
          this._mapDocToHistoryEntity(history)
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

  getListByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.body;

      const historyList = await prisma.history.findMany({
        where: {
          userId,
        },
      });

      res.status(200);
      res.json({
        historyList: historyList.map((history: any) =>
          this._mapDocToHistoryEntity(history)
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

  /**
   * @openapi
   * components:
   *  schemas:
   *    CreateHistoryRequest:
   *      type: object
   *      required:
   *        - userId
   *        - historyType
   *        - result
   *        - description
   *      properties:
   *        userId:
   *          type: string
   *          default: userId
   *        historyType:
   *          type: string
   *          default: BMI
   *        result:
   *          type: string
   *          default: result
   *        description:
   *          type: string
   *          default: description
   */
  createHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, historyType, result, description } = req.body;

      await prisma.history.create({
        data: {
          userId,
          historyType,
          result,
          description,
        },
      });

      res.status(200);
      res.json({ message: 'History sucessfully created' });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(new Error(err.message));
    }
  };

  deleteHistoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { historyId } = req.params;

      const history = await prisma.history.delete({
        where: {
          historyId: parseInt(historyId, 10),
        },
      });

      if (!history) {
        res.status(204);
        res.send();

        return next();
      }

      res.status(200);
      res.json({ message: 'History sucessfully deleted' });

      return next();
    } catch (err: any) {
      res.status(500);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next(new Error(err.message));
    }
  };
}

export default new HistoryController();
