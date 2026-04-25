import express, { type Application, type NextFunction } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import accountRouter from "./account.js";
import { protect } from "./auth.js";
import profileRouter from "./profile.js";
import questionRouter from "./question.js";
import locationRouter from "./location.js";// @ts-ignore

BigInt.prototype.toJSON = function () {
  return Number(this.toString());
};

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else {
      callback(null, origin);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

const logger = (req: Request, _: any, next: NextFunction) => {
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

app.use(logger);
app.use('/account', accountRouter);
app.use('/profile', protect, profileRouter);
app.use('/question', protect, questionRouter);
app.use('/location', protect, locationRouter);

app.listen(3000, () => console.log('Server running at localhost:3000'));
