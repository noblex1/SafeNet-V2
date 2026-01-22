/**
 * File Upload Middleware
 * Handles image uploads for incidents using Cloudinary
 * Uses memory storage to temporarily hold files before uploading to Cloudinary
 */

import multer from 'multer';

// File filter - only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

// Configure multer with memory storage (files stored in memory as Buffer)
// Files will be uploaded to Cloudinary immediately after
export const upload = multer({
  storage: multer.memoryStorage(), // Store in memory temporarily
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file (Cloudinary allows up to 10MB)
    files: 5, // Max 5 files
  },
});

// Configure multer for single profile picture (smaller size limit)
export const uploadSingle = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for profile pictures
    files: 1,
  },
});

// Middleware for multiple images (max 5)
export const uploadIncidentImages = upload.array('images', 5);

// Middleware for single profile picture
export const uploadProfilePicture = uploadSingle.single('profilePicture');
