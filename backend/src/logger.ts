import { type Request, type NextFunction } from 'express';

const requestLogger = (req: Request, _: any, next: NextFunction): void => {
  const { method, url, body } = req;
  const timestamp = new Date().toISOString();

  console.log(`\n--- [${timestamp}] ---`);
  console.log(`Route: ${method} ${url}`);

  if (body && Object.keys(body).length > 0) {
    console.log(`Body:`, JSON.stringify(body, null, 2));
  } else {
    console.log(`Body: (empty)`);
  }

  console.log(`--------------------------`);

  next();
};

export default requestLogger;

