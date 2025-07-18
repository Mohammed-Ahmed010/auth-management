import express, { Request, Response } from "express";

import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		// store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
	})
);
type userType = {
	id: string;
	username: string;
	name: string;
};

app.use(passport.authenticate("session"));

passport.serializeUser(function (user: userType, cb) {
	process.nextTick(function () {
		cb(null, { id: user.id, username: user.username, name: user.name });
	});
});

passport.deserializeUser(function (user: userType, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

app.use("/", authRouter);

app.get("/", (req: Request, res: Response) => {
	return res.send("hello");
});

app.listen(port, () => {
	console.log(`listening at ${port}`);
});
