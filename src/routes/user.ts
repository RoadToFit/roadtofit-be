import { Router } from 'express';

import UserController from '../controllers/user';

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/register', UserController.register);
  }
}

export default new UserRoutes().router;
