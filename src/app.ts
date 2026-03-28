import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://tuition-manager.netlify.app'],
    credentials: true,
  }),
);

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hi Developer !');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
