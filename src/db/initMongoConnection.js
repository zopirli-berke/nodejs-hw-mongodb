import mongoose from 'mongoose';
import { getEnvVar } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const dbName = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established');
  } catch (error) {
    console.error('Mongo connection error:', error.message);
    throw error;
  }
};
