const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.js');
const swaggerJSDoc = require('swagger-jsdoc');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Your API Description',
    },
  },
  apis:['./backend/server.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
