import express, { type Application, type Request, type Response } from "express";
import cookieParser from 'cookie-parser';
import requestLogger from "./logger.js";
import accountRouter from "./account.js";
import { protect } from "./auth.js";
import profileRouter from "./profile.js";
import questionRouter from "./question.js";

const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use('/account', accountRouter);
app.use('/profile', protect, profileRouter);
app.use('/question', protect, questionRouter);

app.listen(3000, () => console.log('Server running at localhost:3000'));
