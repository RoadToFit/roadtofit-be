import { Router } from 'express';

import Middleware from '../middleware/middleware';
import ActivityController from '../controllers/Activity';

import validator from '../utils/validator';
import * as RouteValidator from '../validators/RouteValidator';

class ActivityRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    /**
     * @openapi
     * '/activities/list':
     *  get:
     *    tags:
     *      - Activity
     *    summary: Get activity list
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetActivityListResponse'
     */
    this.router.get(
      '/list',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      ActivityController.getList,
    );
    
    /**
     * @openapi
     * '/activities/{activityId}':
     *  get:
     *    tags:
     *      - Activity
     *    summary: Get activity by id
     *    parameters:
     *      - in: path
     *        name: activityId
     *        required: true
     *        schema:
     *          type: integer
     *          minimum: 1
     *        description: The activity ID
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetActivityByIdResponse'
     */
    this.router.get(
      '/:activityId',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      validator(RouteValidator.activityIdParam),
      ActivityController.getById,
    );

    /**
     * @openapi
     * '/activities/file':
     *  post:
     *    tags:
     *      - Activity
     *    summary: Generate activity from file
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GenerateActivityFromFileResponse'
     */
    this.router.post(
      '/file',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      ActivityController.generateActivityFromFile,
    );
  }
}

export default new ActivityRoutes().router;
