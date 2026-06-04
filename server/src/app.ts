import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import taskRoutes from './routes/task.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.message === 'Task not found' ? 404 : 500;
  res.status(status).json({ message: err.message });
});

export default app;