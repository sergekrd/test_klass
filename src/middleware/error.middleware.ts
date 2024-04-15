import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../common/errors/custom.error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    err as CustomError;
    res.status(err.status_code).json({
      status: 'error',
      message: err.message,
    });
  } else {
    console.log(err)
    res.status(500).json({
      status: 'error',
      message: 'Internal error',
    });
  }
}
