// EN: Swagger configuration using swagger-jsdoc for API documentation
import swaggerJsdoc from 'swagger-jsdoc';
import { ENV_CONFIG } from './envConfig';
import { logger } from '../utils/logger';  // Logger import

// EN: Define Swagger options, including OpenAPI info, server, security schemes, and API files
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather API',
      version: '1.0.0',
      description: `
A weather query system using the OpenWeather API with JWT-based and role-based access control.

**Created by Hamza URAŞ.**  
Contact me for any questions or issues.  
[LinkedIn Profile](https://www.linkedin.com/in/hamza-uras/)
`,
    },
    servers: [
      {
        url: ENV_CONFIG.HOST + ENV_CONFIG.PORT,
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // EN: Location of swagger annotation comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
