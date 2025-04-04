import express from "express";
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, validateRequest, NotFoundError, currentUser } from "@psmtickets/common";
import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async(req, res, next) => {
  next(new NotFoundError());
 });
 
 app.use(errorHandler);
 
export { app };