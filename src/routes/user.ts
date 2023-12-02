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
    // TODO:
    this.router.post('/register', UserController.register);
    this.router.post('/login', UserController.login);

    this.router.get('/list', UserController.getUserList);
    this.router.get('/', Middleware.auth, UserController.getUserById);
    this.router.put('/', Middleware.auth, UserController.updateUserById);
    this.router.put(
      '/image/',
      Middleware.auth,
      UserController.updateUserImageById
    );
    this.router.delete('/', Middleware.auth, UserController.deleteUserById);
  }
}

export default new UserRoutes().router;
