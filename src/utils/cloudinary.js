import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import createHttpError from 'http-errors';
import fs from 'node:fs/promises';

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'contacts',

      public_id: `${file.fieldname}-${Date.now()}`,
    });

    await fs.unlink(file.path);

    return result.secure_url;
  } catch (error) {
    await fs.unlink(file.path);

    throw createHttpError(500, 'Failed to upload file to Cloudinary');
  }
};
