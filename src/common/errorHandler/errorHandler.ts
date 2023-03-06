import {NextFunction, Request, Response} from 'express';
import {ApiError} from './apiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.code).json({message: err.message});
    next();
    return;
  }
  console.error(err);
  res.status(400).json({message: 'Smth broke'});
  next();
};
