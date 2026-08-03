import swaggerJsdoc from 'swagger-jsdoc';

const isProd = process.env.NODE_ENV === 'production';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WhistleSpace API',
      version: '1.0.0',
      description: 'API documentation for the WhistleSpace backend platform.'
    },
    servers: [
      {
        url: process.env.APP_URL || 'http://localhost:3000',
        description: isProd ? 'Production server' : 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/**/*.js', './api/**/*.js']
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
