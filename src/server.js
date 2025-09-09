import express from 'express';
import { getEnvVar } from './utils/env.js';
import pinoHttp from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import logger from './config/logger.js';
import { corsOptions } from './config/cors.js';
import {
  getAllContactsController,
  getContactByIdController,
} from './controllers/contacts.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ corsOptions }));
  app.use(pinoHttp({ logger }));
  app.use(express.json());

  app.get('/contacts', getAllContactsController);

  app.get('/contacts/:contactId', getContactByIdController);

  // ERROR HANDLING MIDDLEWARE
  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
