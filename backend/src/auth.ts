import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: Function) => {
  // fetch token either from cookies or from headers depending on how it is sent
  const token = req.cookies?.token || req.headers?.cookie?.split('=')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Session expired' });
  }
};
