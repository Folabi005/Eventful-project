import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes';
import errorHandler from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';

const app = express();
app.use(cors());

app.use(express.json());
app.use(apiRateLimiter);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Eventful API',
    version: '1.0.0',
    description: 'Eventful backend API for events, tickets, reminders, analytics and payments.',
  },
  servers: [{ url: process.env.API_URL || 'http://localhost:4000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};
const swaggerSpec = swaggerJsdoc({ definition: swaggerDefinition, apis: ['./src/routes/*.ts'] });

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_req, res) => res.json({ ok: true, message: 'Eventful API is running', docs: '/api/docs' }));
app.use('/api', routes);
app.use(errorHandler);

export default app;
