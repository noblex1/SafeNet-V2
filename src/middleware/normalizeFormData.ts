/**
 * Normalize FormData Location
 * Converts location[address] notation to nested object for validation
 */

import { Request, Response, NextFunction } from 'express';

export const normalizeFormDataLocation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Only process if this looks like FormData with bracket notation
  if (req.body['location[address]']) {
    // Convert bracket notation to nested object
    req.body.location = {
      address: req.body['location[address]'],
      coordinates: req.body['location[coordinates][lat]'] && req.body['location[coordinates][lng]']
        ? {
            lat: parseFloat(req.body['location[coordinates][lat]']),
            lng: parseFloat(req.body['location[coordinates][lng]']),
          }
        : undefined,
    };
    
    // Clean up bracket notation fields
    delete req.body['location[address]'];
    delete req.body['location[coordinates][lat]'];
    delete req.body['location[coordinates][lng]'];
  }
  
  next();
};
