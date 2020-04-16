import { Request, Response, NextFunction } from 'express';

export function logRequest(request: Request, response: Response, next: NextFunction) {
  console.log(`${Date.now()} : Processing ${request.method} for ${request.path}`);
  next();
}
