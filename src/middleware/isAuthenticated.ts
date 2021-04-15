import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  return res.sendStatus(UNAUTHORIZED);
}
