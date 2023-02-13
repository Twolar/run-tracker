const {logger} = require('./src/utility/logger');

const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Listening: http://localhost:${port}`);
});