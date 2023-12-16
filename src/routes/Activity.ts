import { Router } from 'express';

// import Middleware from '../middleware/middleware';
import ActivityController from '../controllers/Activity';
import * as DataController from '../controllers/Data';

// import validator from '../utils/validator';
// import * as ActivityValidator from '../validators/ActivityValidator';

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
     *    security: []
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                activityList:
     *                  type: array
     *                  items:
     *                    $ref: '#/components/schemas/ActivityEntity'
     */
    this.router.get(
      '/list',
      ActivityController.getList,
    );
    
    /**
     * @openapi
     * '/activities/{activityId}':
     *  get:
     *    tags:
     *      - Activity
     *    summary: Get activity by id
     *    security: []
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
     *              type: object
     *              properties:
     *                activity:
     *                  $ref: '#/components/schemas/ActivityEntity'
     */
    this.router.get(
      '/:activityId',
      ActivityController.getById,
    );

    /**
     * @openapi
     * '/activities':
     *  post:
     *    tags:
     *      - Activity
     *    summary: Create activity from file
     *    requestBody:
     *      content:
     *        multipart/form-data:
     *          schema:
     *            type: object
     *            properties:
     *              file:
     *                type: string
     *                format: binary
     *    responses:
     *      200:
     *        description: Activitys sucessfully created.
     */
    this.router.post(
      '/',
      DataController.upload.single('file'),
      // ActivityController.createActivityFromFile,
    );
  }
}

export default new ActivityRoutes().router;
