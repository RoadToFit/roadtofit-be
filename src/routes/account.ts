import { Router } from 'express';

import AccountController from '../controllers/account';

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/register', AccountController.register);
  }
}

export default new AuthRoutes().router;
