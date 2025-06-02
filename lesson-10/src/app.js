import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

app.use(notFoundHandler);

export default app;
