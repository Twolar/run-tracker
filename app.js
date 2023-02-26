const {logger} = require('./src/utility/logger');
const express = require('express');
const api = require('./src/api');
require('dotenv').config();

const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/v1', api);
app.use(
  express.urlencoded(),
  cors({
      origin: `http://localhost:${port}`
  })
);

app.listen(port, () => {
  logger.info(`Listening: http://localhost:${port}`);
});

module.exports = app;