import express, { Request, Response } from "express";

import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", authRouter);

app.get("/", (req: Request, res: Response) => {
	return res.send("hello");
});

app.listen(port, () => {
	console.log(`listening at ${port}`);
});
