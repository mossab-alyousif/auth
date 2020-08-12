import express, { Request, Response, NextFunction } from 'express';
import volleyball from 'volleyball';
import dotenv from 'dotenv';
import router from './auth/index';

dotenv.config();
const port = process.env.SERVER_PORT;

const app = express();
app.use(volleyball);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', router);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World!'
  });
});

function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log('Listening on port', port);
});
