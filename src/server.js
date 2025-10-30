import express from 'express';
import { getEnvVar } from './utils/env.js';
import pinoHttp from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import logger from './config/logger.js';
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ corsOptions }));
  app.use(pinoHttp({ logger }));

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      status: 200,
      message: 'Welcome to the Contacts API!',
    });
  });

  app.use(router);

  // ERROR HANDLING MIDDLEWARE
  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
