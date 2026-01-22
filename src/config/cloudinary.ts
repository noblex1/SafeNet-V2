/**
 * Cloudinary Configuration
 * Handles image upload and storage
 */

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param fileBuffer - File buffer from multer
 * @param folder - Cloudinary folder path (optional)
 * @param isProfilePicture - Whether this is a profile picture (affects transformation)
 * @returns Promise with Cloudinary upload result
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'safenet/incidents',
  isProfilePicture: boolean = false
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const transformation = isProfilePicture
      ? [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Square crop, focus on face
          { quality: 'auto' },
          { format: 'auto' },
        ]
      : [
          { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
          { quality: 'auto' }, // Auto quality optimization
          { format: 'auto' }, // Auto format (webp when supported)
        ];

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error('Upload failed: No result from Cloudinary'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info('Image deleted from Cloudinary', { publicId });
  } catch (error) {
    logger.error('Error deleting from Cloudinary:', error);
    // Don't throw - deletion failures shouldn't break the app
  }
};

export default cloudinary;
