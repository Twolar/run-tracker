require('dotenv').config();
const {logger} = require('./src/utility/logger');
const express = require('express');
const api = require('./src/api');

const cors = require('cors');

const app = express();

const port = process.env.PORT || 80;

app.use(express.json());
app.use('/api/v1', api);
app.use(
  express.urlencoded(),
  cors()
);

app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});

module.exports = app;