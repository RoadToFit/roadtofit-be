import { Router } from 'express';

import Middleware from '../middleware/middleware';
import FoodController from '../controllers/Food';

import validator from '../utils/validator';
import * as RouteValidator from '../validators/RouteValidator';

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
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      FoodController.getList,
    );
    
    /**
     * @openapi
     * '/foods/{foodId}':
     *  get:
     *    tags:
     *      - Food
     *    summary: Get food by id
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
      validator(RouteValidator.bearerToken),
      Middleware.auth,
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
      FoodController.generateFoodFromFile,
    );
  }
}

export default new FoodRoutes().router;
