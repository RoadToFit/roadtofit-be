import { Router } from 'express';

import Middleware from '../middleware/middleware';
import UserController from '../controllers/User';
import * as DataController from '../controllers/Data';

import validator from '../utils/validator';
import * as UserValidator from '../validators/UserValidator'
import * as RouteValidator from '../validators/RouteValidator'

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    /**
     * @openapi
     * '/users/register':
     *  post:
     *    tags:
     *      - Authentication
     *    summary: Register
     *    security: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/RegisterRequest'
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/RegisterResponse'
     */
    this.router.post(
      '/register',
      validator(UserValidator.register),
      UserController.register,
    );

    /**
     * @openapi
     * '/users/login':
     *  post:
     *    tags:
     *      - Authentication
     *    summary: Login
     *    security: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/LoginRequest'
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/LoginResponse'
     */
    this.router.post(
      '/login',
      validator(UserValidator.login),
      UserController.login,
    );

    /**
     * @openapi
     * '/users/list':
     *  get:
     *    tags:
     *      - User
     *    summary: Get user list
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetUserListResponse'
     */
    this.router.get(
      '/list',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      UserController.getList,
    );
    
    /**
     * @openapi
     * '/users':
     *  get:
     *    tags:
     *      - User
     *    summary: Get user by ID
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetUserByIdResponse'
     */
    this.router.get(
      '/',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      UserController.getById,
    );

    /**
     * @openapi
     * '/users':
     *  put:
     *    tags:
     *      - User
     *    summary: Update a user by id
     *    requestBody:
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/UpdateUserByIdRequest'
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UpdateUserByIdResponse'
     */
    this.router.put(
      '/',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      validator(UserValidator.updateById),
      UserController.updateById,
    );
    
    /**
     * @openapi
     * '/users/recommendation':
     *  put:
     *    tags:
     *      - User
     *    summary: Update a user bmi and recommendation by id
     *    requestBody:
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/UpdateUserRecommendationByIdRequest'
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UpdateUserRecommendationByIdResponse'
     */
    this.router.put(
      '/recommendation',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      UserController.updateRecommendationById,
    );

    /**
     * @openapi
     * '/users/image':
     *  put:
     *    tags:
     *      - User
     *    summary: Update a user image by id
     *    requestBody:
     *      content:
     *        multipart/form-data:
     *          schema:
     *            $ref: '#/components/schemas/UpdateUserImageByIdRequest'
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UpdateUserImageByIdResponse'
     */
    this.router.put(
      '/image/',
      validator(RouteValidator.bearerToken),
      DataController.uploadUserImage.single('file'),
      Middleware.auth,
      validator(UserValidator.updateImageById),
      UserController.updateImageById
    );

    /**
     * @openapi
     * '/users/{userId}':
     *  delete:
     *    tags:
     *      - User
     *    summary: Delete a user by id
     *    parameters:
     *      - in: path
     *        name: userId
     *        required: true
     *        schema:
     *          type: integer
     *          minimum: 1
     *        description: The user ID
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/DeleteUserByIdResponse'
     */
    this.router.delete(
      '/',
      validator(RouteValidator.bearerToken),
      Middleware.auth,
      validator(UserValidator.deleteById),
      UserController.deleteById,
    );
  }
}

export default new UserRoutes().router;
