import { Request, Response, NextFunction } from 'express';

// Logs some basic info for the specified request to the console.
export function logRequest(request: Request, response: Response, next: NextFunction) {
    console.log(`${Date.now()} : Processing ${request.method} for ${request.path}`);
    next();
}
