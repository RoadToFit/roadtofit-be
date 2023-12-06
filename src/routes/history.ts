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
    /**
     * @openapi
     * '/histories/list':
     *  get:
     *    tags:
     *      - History
     *    summary: Get history list
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                historyList:
     *                  $ref: '#/components/schemas/HistoryEntity'
     */
    this.router.get(
      '/list',
      Middleware.auth,
      HistoryController.getHistoryList,
    );
    
    /**
     * @openapi
     * '/histories':
     *  get:
     *    tags:
     *      - History
     *    summary: Get user history list by user id
     */
    this.router.get(
      '/',
      Middleware.auth,
      HistoryController.getHistoryListByUserId,
    );

    /**
     * @openapi
     * '/histories':
     *  post:
     *    tags:
     *      - History
     *    summary: Create a history
     */
    this.router.post(
      '/',
      Middleware.auth,
      HistoryController.createHistory,
    );

    /**
     * @openapi
     * '/histories':
     *  delete:
     *    tags:
     *      - History
     *    summary: Delete a history
     */
    this.router.delete(
      '/:historyId',
      Middleware.auth,
      HistoryController.deleteHistoryById,
    );
  }
}

export default new HistoryRoutes().router;
