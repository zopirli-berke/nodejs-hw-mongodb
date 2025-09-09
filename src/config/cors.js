import { getEnvVar } from '../utils/env.js';

const allowedOriginsRaw = getEnvVar('ALLOWED_ORIGINS', '');

const whitelist = allowedOriginsRaw.split(',').map((origin) => origin.trim());

console.log('Allowed CORS Origins:', whitelist);

export const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

  allowedHeaders: ['Content-Type', 'Authorization'],

  credentials: true,
};
