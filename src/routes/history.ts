import { Router } from 'express';

import HistoryController from '../controllers/history';

class HistoryRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/', HistoryController.getHistoryList);
    this.router.get('/:userId', HistoryController.getHistoryListByUserId);
    this.router.post('/', HistoryController.createHistory);
    this.router.delete('/:historyId', HistoryController.deleteHistoryById);
  }
}

export default new HistoryRoutes().router;
