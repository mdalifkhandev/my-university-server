import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notFount from './app/middlewere/notfound';
import router from './app/router';
import globalErrorHendleing from './app/middlewere/globalErrorHendleing';
import cookieParser from 'cookie-parser';

const app: Application = express();

//percer
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'],
  credentials:true
 }));
app.use(cookieParser());

//application rought
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  res.send("'Hello World!'");
};
app.get('/', test);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(globalErrorHendleing);

//nor fount
app.use(notFount);

export default app;
