require('dotenv').config();
const {logger} = require('./src/utility/logger');
const express = require('express');
const api = require('./src/api');

const app = express();

const port = 5000;

app.use(express.json());
app.use('/api/v1', api);
app.use(express.urlencoded());

app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});

module.exports = app;