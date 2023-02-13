const express = require('express');
const api = require('./src/api');

const app = express();

app.use(express.json());
app.use('/api/v1', api);

module.exports = app;
