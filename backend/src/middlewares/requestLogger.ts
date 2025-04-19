import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
  });

  next();
};

export default requestLogger;
