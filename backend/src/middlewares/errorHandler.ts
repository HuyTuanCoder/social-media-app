import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Handle unknown endpoints
const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({ error: 'Unknown endpoint' });
};

// Error-handling middleware
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
};

export { unknownEndpoint, errorHandler };
