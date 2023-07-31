import { Request, Response, NextFunction } from "express";
export function isScrum(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const auth = request.headers.authorization;
  next();
}
