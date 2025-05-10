import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  }),
);

app.get('/', (req, res) => {
  res.json({ message: 'Hello world' });
});

app.listen(8080, (error) => {
  if (error) {
    throw error;
  }
  console.log('Server 8080');
});
