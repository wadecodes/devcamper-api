const dotenv = require('dotenv');
const express = require('express');

//Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.use('/', (req, res, next) => {
  res.send('Hello');
});

app.listen(PORT, () => {
  console.log(`App listening in ${process.env.NODE_ENV} mode on port ${PORT}!`);
});
