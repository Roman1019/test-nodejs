import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
const app = express();

app.use('/api', routes);

app.use(errorHandler);

app.use(notFoundHandler);

export default app;
