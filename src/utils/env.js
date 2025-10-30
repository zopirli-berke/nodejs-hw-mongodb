import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error('Environment variable is not set:', name);
}

export const env = {
  // Sunucu
  PORT: getEnvVar('PORT', '3000'),
  APP_DOMAIN: getEnvVar('APP_DOMAIN', 'http://localhost:3000'),

  // MongoDB
  MONGODB_USER: getEnvVar('MONGODB_USER'),
  MONGODB_PASSWORD: getEnvVar('MONGODB_PASSWORD'),
  MONGODB_URL: getEnvVar('MONGODB_URL'),
  MONGODB_DB: getEnvVar('MONGODB_DB'),

  // JWT
  JWT_SECRET: getEnvVar('JWT_SECRET'),

  // SMTP
  SMTP_HOST: getEnvVar('SMTP_HOST'),
  SMTP_PORT: getEnvVar('SMTP_PORT'),
  SMTP_USER: getEnvVar('SMTP_USER'),
  SMTP_PASSWORD: getEnvVar('SMTP_PASSWORD'),
  SMTP_FROM: getEnvVar('SMTP_FROM'),

  //Cloudinary
  CLOUDINARY_NAME: getEnvVar('CLOUDINARY_NAME'),
  CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET'),
};
