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
     *        description: User sucessfully created.
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
     *              type: object
     *              properties:
     *                userList:
     *                  type: array
     *                  items:
     *                    $ref: '#/components/schemas/UserEntity'
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
     *    summary: Get a user by id
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                user:
     *                  $ref: '#/components/schemas/UserEntity'
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
     *            $ref: '#/components/schemas/UpdateByIdRequest'
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                user:
     *                  $ref: '#/components/schemas/UserEntity'
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
     * '/users/image':
     *  put:
     *    tags:
     *      - User
     *    summary: Update a user image by id
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
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                user:
     *                  $ref: '#/components/schemas/UserEntity'
     */
    this.router.put(
      '/image/',
      validator(RouteValidator.bearerToken),
      DataController.upload.single('file'),
      Middleware.auth,
      validator(UserValidator.updateImageById),
      UserController.updateImageById
    );

    /**
     * @openapi
     * '/users':
     *  delete:
     *    tags:
     *      - User
     *    summary: Delete a user by id
     *    responses:
     *      200:
     *        description: Success
     */
    this.router.delete(
      '/',
      Middleware.auth,
      UserController.deleteById,
    );
  }
}

export default new UserRoutes().router;
