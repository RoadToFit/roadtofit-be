import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { config as dotenv } from 'dotenv';

import UserRouter from './routes/user';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.routes();
    dotenv();
  }

  protected plugins(): void {
    this.app.use(bodyParser.json());
  }

  protected routes(): void {
    this.app.use('/users', UserRouter);
  }
}

const port: number = 8000;
const { app } = new App();
app.listen(port);

// eslint-disable-next-line no-console
console.log(`Listening on port: ${port}`);
