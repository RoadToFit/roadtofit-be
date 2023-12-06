import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { config as dotenv } from 'dotenv';

import UserRouter from './routes/user';
import HistoryRouter from './routes/history';

import swaggerDocs from './utils/swagger';

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
    this.app.use(cors());
    this.app.use(morgan('dev'));
    swaggerDocs(this.app);
  }

  protected routes(): void {
    this.app.use('/users', UserRouter);
    this.app.use('/histories', HistoryRouter);
  }
}

const PORT = process.env.PORT || 4000;
const { app } = new App();
app.listen(PORT);

// eslint-disable-next-line no-console
console.log(`Listening on port: ${PORT}`);
