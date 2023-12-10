import { Router } from 'express';

import Middleware from '../middleware/middleware';
import HistoryController from '../controllers/History';

import validator from '../utils/validator';
import * as HistoryValidator from '../validators/HistoryValidator';
import * as RouteValidator from '../validators/RouteValidator';

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
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      HistoryController.getList,
    );
    
    /**
     * @openapi
     * '/histories':
     *  get:
     *    tags:
     *      - History
     *    summary: Get user history list by user id
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
      '/',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      HistoryController.getListByUserId,
    );

    /**
     * @openapi
     * '/histories':
     *  post:
     *    tags:
     *      - History
     *    summary: Create a history
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/CreateHistoryRequest'
     *    responses:
     *      200:
     *        description: History sucessfully created.
     */
    this.router.post(
      '/',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      validator(HistoryValidator.create),
      HistoryController.createHistory,
    );

    /**
     * @openapi
     * '/histories/{historyId}':
     *  delete:
     *    tags:
     *      - History
     *    summary: Delete a history
     *    parameters:
     *      - in: path
     *        name: historyId
     *        required: true
     *        schema:
     *          type: integer
     *          minimum: 1
     *        description: The history ID
     *    responses:
     *      200:
     *        description: History sucessfully deleted.
     */
    this.router.delete(
      '/:historyId',
      validator(RouteValidator.bearerToken),
      validator(RouteValidator.historyIdParam),
      Middleware.auth,
      HistoryController.deleteHistoryById,
    );
  }
}

export default new HistoryRoutes().router;
