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
     *              $ref: '#/components/schemas/GetFoodListResponse'
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
     *              $ref: '#/components/schemas/GetFoodByIdResponse'
     */
    this.router.get(
      '/:foodId',
      (req, res, next) => {
        if (req.params.foodId.toLowerCase() === 'list') {
          // Skip execution if the parameter is 'list'
          return next('route');
        }
        return next();
      },
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      validator(RouteValidator.foodIdParam),
      FoodController.getById,
    );

    /**
     * @openapi
     * '/foods/file':
     *  post:
     *    tags:
     *      - Food
     *    summary: Generate food from file
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GenerateFoodFromFileResponse'
     */
    this.router.post(
      '/file',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      FoodController.generateFoodFromFile,
    );
  }
}

export default new FoodRoutes().router;
