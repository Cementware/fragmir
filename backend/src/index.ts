import express, { type Application, type Request, type Response } from "express";
import requestLogger from "./logger.js";
import accountRouter from "./account.js";

const app: Application = express();
app.use(express.json());

app.use(requestLogger);
app.use('/account', accountRouter);

app.listen(3000, () => console.log('Server running at localhost:3000'));
