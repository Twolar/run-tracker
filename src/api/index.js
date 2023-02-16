const express = require('express');
const completedRuns = require('./routes/completedRuns');
const users = require('./routes/users');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

router.use('/completedRuns', completedRuns);
router.use('/users', users);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taylor\'s Run Tracker API',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Default',
      },
    ],
  },
  apis: [ // files containing swagger annotations as above
    './src/api/routes/completedRuns.js',
    './src/api/routes/users.js'
  ], 
};
const openapiSpecification = swaggerJsdoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

module.exports = router;
