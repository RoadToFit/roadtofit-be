import { Router } from 'express';

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

    this.router.get('/', UserController.getUserList);
    this.router.get('/:userId', UserController.getUserById);
    this.router.put('/:userId', UserController.updateUserById);
    this.router.put('/image/:userId', UserController.updateUserImageById);
    this.router.delete('/:userId', UserController.deleteUserById);
  }
}

export default new UserRoutes().router;
