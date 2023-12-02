import { Router } from 'express';

import Middleware from '../middleware/middleware';
import HistoryController from '../controllers/history';

class HistoryRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/list', Middleware.auth, HistoryController.getHistoryList);
    this.router.get(
      '/',
      Middleware.auth,
      HistoryController.getHistoryListByUserId
    );
    this.router.post('/', Middleware.auth, HistoryController.createHistory);
    this.router.delete(
      '/:historyId',
      Middleware.auth,
      HistoryController.deleteHistoryById
    );
  }
}

export default new HistoryRoutes().router;
