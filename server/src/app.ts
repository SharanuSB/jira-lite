import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import taskRoutes from './routes/task.routes';
import { NotFoundError } from './utils/errors';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
}));

app.use('/api/tasks', taskRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err instanceof NotFoundError ? 404 : 500;
  res.status(status).json({ message: err.message });
});

export default app;
