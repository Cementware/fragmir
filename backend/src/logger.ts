import { type Request, type NextFunction } from 'express';

// Middleware with explicit TypeScript types
const requestLogger = (req: Request, _: any, next: NextFunction): void => {
  const { method, url, body } = req;
  const timestamp = new Date().toISOString();

  console.log(`\n--- [${timestamp}] ---`);
  console.log(`📡 Route: ${method} ${url}`);

  // Using a guard to check if body has content
  if (body && Object.keys(body).length > 0) {
    console.log(`📦 Body:`, JSON.stringify(body, null, 2));
  } else {
    console.log(`📦 Body: (empty)`);
  }

  console.log(`--------------------------`);

  // Ensure next() is called to pass control to the next handler
  next();
};

export default requestLogger;

