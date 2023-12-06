import { Router } from 'express';

import Middleware from '../middleware/middleware';
import UserController from '../controllers/user';

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
     *        description: User sucessfully created.
     */
    this.router.post('/login', UserController.login);

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
     *                  $ref: '#/components/schemas/UserEntity'
     */
    this.router.get(
      '/list',
      UserController.getUserList,
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
     *                userList:
     *                  $ref: '#/components/schemas/UserEntity'
     */
    this.router.get(
      '/',
      Middleware.auth,
      UserController.getUserById,
    );

    /**
     * @openapi
     * '/users':
     *  put:
     *    tags:
     *      - User
     *    summary: Update a user by id
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                userList:
     *                  $ref: '#/components/schemas/UserEntity'
     */
    this.router.put(
      '/',
      Middleware.auth,
      UserController.updateUserById,
    );

    /**
     * @openapi
     * '/users/image':
     *  put:
     *    tags:
     *      - User
     *    summary: Update a user image by id
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                userList:
     *                  $ref: '#/components/schemas/UserEntity'
     */
    this.router.put(
      '/image/',
      Middleware.auth,
      UserController.updateUserImageById
    );

    /**
     * @openapi
     * '/users/image':
     *  delete:
     *    tags:
     *      - User
     *    summary: Delete a user by id
     *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                userList:
     *                  $ref: '#/components/schemas/UserEntity'
     */
    this.router.delete(
      '/',
      Middleware.auth,
      UserController.deleteUserById,
    );
  }
}

export default new UserRoutes().router;
