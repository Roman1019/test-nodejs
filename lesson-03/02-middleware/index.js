import express from 'express';

const app = express();

app.use((req, res, next) => {
  console.log('Middleware A');
  next();
});

app.use((req, res, next) => {
  console.log('Middleware B');
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello world' });
});

const PORT = 8080;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server ${PORT}`);
});
