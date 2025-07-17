import express, { Request, Response, Router } from "express";
import passport from "passport";
import connectPrismaClient from "../controllers/index";
import GoogleStrategy from "passport-google-oidc";

type profileType = {
	id: string | null;
	displayname: string;
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/oauth2/redirect/google",
			scope: ["profile"],
		},
		async function verify(issuer: string, profile: profileType, cb: any) {
			console.log(`profile display :${profile.displayname}`);

			const prisma = connectPrismaClient(process.env.DATABASE_URL);
			const user = await prisma.federated_credentials.findFirst({
				where: {
					provider: issuer,
					subject: profile.id,
				},
			});
			if (!user) {
				const newUser = await prisma.users.create({
					data: {
						username: "Ahmed",
					},
				});
				const id = newUser.id;
				const fedUser = await prisma.federated_credentials.create({
					data: {
						user_id: id,
						provider: issuer,
						subject: profile.id,
					},
				});
				return cb(null, user);
			}

			return cb(null, user);
		}
	)
);
const authRouter = express.Router();

authRouter.get("/login", (req: Request, res: Response) => {
	return res.send("login");
});
authRouter.get("/login/federated/google", passport.authenticate("google"));
// /oauth2/redirect/google
authRouter.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", {
		successRedirect: "/",
		failureRedirect: "/login",
	})
);
authRouter.post("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

export default authRouter;
