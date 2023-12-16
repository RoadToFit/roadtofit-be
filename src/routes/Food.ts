import { Router } from 'express';

// import Middleware from '../middleware/middleware';
import FoodController from '../controllers/Food';
import * as DataController from '../controllers/Data';

// import validator from '../utils/validator';
// import * as FoodValidator from '../validators/FoodValidator';

class FoodRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    /**
     * @openapi
     * '/foods/list':
     *  get:
     *    tags:
     *      - Food
     *    summary: Get food list
     *    security: []
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                foodList:
     *                  type: array
     *                  items:
     *                    $ref: '#/components/schemas/FoodEntity'
     */
    this.router.get(
      '/list',
      FoodController.getList,
    );
    
    /**
     * @openapi
     * '/foods/{foodId}':
     *  get:
     *    tags:
     *      - Food
     *    summary: Get food by id
     *    security: []
     *    parameters:
     *      - in: path
     *        name: foodId
     *        required: true
     *        schema:
     *          type: integer
     *          minimum: 1
     *        description: The food ID
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                food:
     *                  $ref: '#/components/schemas/FoodEntity'
     */
    this.router.get(
      '/:foodId',
      FoodController.getById,
    );

    /**
     * @openapi
     * '/foods':
     *  post:
     *    tags:
     *      - Food
     *    summary: Create food from file
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
     *        description: Foods sucessfully created.
     */
    this.router.post(
      '/',
      DataController.upload.single('file'),
      // FoodController.createFoodFromFile,
    );
  }
}

export default new FoodRoutes().router;
