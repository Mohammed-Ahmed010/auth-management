import express, { Request, Response, Router } from "express";
import passport from "passport";

const authRouter = express.Router();

authRouter.get("/login", (req: Request, res: Response) => {
	return res.send("login");
});

export default authRouter;
