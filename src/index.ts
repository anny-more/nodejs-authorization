import express from 'express';

const PORT = 8080;
const app = express();

app.listen(PORT, () => {
  console.log('server start on port', PORT);
});
