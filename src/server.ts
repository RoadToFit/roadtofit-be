import express, { Application, Request } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { config as dotenv } from 'dotenv';

import UserRouter from './routes/User';
import FoodRouter from './routes/Food';
import ActivityRouter from './routes/Activity';

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
    morgan.token('reqbody', (req: Request) => JSON.stringify(req.body));
    this.app.use(morgan(':method :url :status --body :reqbody'));
    swaggerDocs(this.app);
  }

  protected routes(): void {
    this.app.use('/users', UserRouter);
    this.app.use('/foods', FoodRouter);
    this.app.use('/activities', ActivityRouter);
  }
}

const PORT = process.env.PORT || 4000;
const { app } = new App();
app.listen(PORT);

console.log(`Listening on port: ${PORT}`);
