import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import path from 'node:path';

const app = express();

app.use('/avatars', express.static(path.resolve('src', 'uploads', 'avatars')));

app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

app.use(notFoundHandler);

export default app;
