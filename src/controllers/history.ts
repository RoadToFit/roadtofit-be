import { NextFunction, Request, Response } from 'express';
import prisma from '../utils/db.server';

type HistoryEntity = {
  historyId: string;
  userId: number;
  weight: number;
  height: number;
  status: string;
  createdAt: Date;
};

class HistoryController {
  private _mapDocToHistoryEntity = (doc: any): HistoryEntity => ({
    historyId: doc.historyId,
    userId: doc.userId,
    status: doc.status,
    weight: doc.weight,
    height: doc.height,
    createdAt: new Date(doc.createdAt),
  });

  getHistoryList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const historyList = await prisma.history.findMany();

      res.status(200);
      res.send({
        historyList: historyList.map((history: any) => this._mapDocToHistoryEntity(history)),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      res.send(err.message);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  getHistoryListByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const parsedUserId = parseInt(userId, 10);

      if (userId === undefined || Number.isNaN(parsedUserId)) {
        throw new Error('Invalid request.');
      }

      const historyList = await prisma.history.findMany({
        where: {
          userId: parsedUserId,
        },
      });

      res.status(200);
      res.send({
        historyList: historyList.map((history: any) => this._mapDocToHistoryEntity(history)),
      });

      return next();
    } catch (err: any) {
      res.status(500);
      res.send(err.message);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  createHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        userId,
        weight,
        height,
        status,
      } = req.body;

      if (userId === undefined
        || weight === undefined
        || height === undefined
        || status === undefined
      ) {
        throw new Error('Invalid request.');
      }

      await prisma.history.create({
        data: {
          userId,
          weight,
          height,
          status,
        },
      });

      res.status(200);
      res.send('History sucessfully created.');

      return next();
    } catch (err: any) {
      res.status(500);
      res.send(err.message);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };

  deleteHistoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { historyId } = req.params;
      const parsedHistoryId = parseInt(historyId, 10);

      if (historyId === undefined || Number.isNaN(parsedHistoryId)) {
        throw new Error('Invalid request.');
      }

      const history = await prisma.history.delete({
        where: {
          historyId: parsedHistoryId,
        },
      });

      if (!history) {
        res.status(204);
        res.send();

        return next();
      }

      res.status(200);
      res.send('History successfully deleted.');

      return next();
    } catch (err: any) {
      res.status(500);
      res.send(err.message);
      // eslint-disable-next-line no-console
      console.log(err.message);

      return next();
    }
  };
}

export default new HistoryController();
