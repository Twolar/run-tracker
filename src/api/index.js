const express = require('express');
const completedRuns = require('./routes/completedRuns'); 
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

router.use('/completedRuns', completedRuns);

const options = {
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
  apis: ['./src/api/routes/completedRuns.js'], // files containing annotations as above
};
const openapiSpecification = swaggerJsdoc(options);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

module.exports = router;
