import express, { type Application, type Request, type Response } from "express";
import requestLogger from "./logger.js";

const app: Application = express();
app.use(express.json());

app.use(requestLogger);


app.listen(3000, () => console.log('Server running at localhost:3000'));
