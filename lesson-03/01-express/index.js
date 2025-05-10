import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World))))' });
});

const PORT = 8080;

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server ${PORT}`);
});
