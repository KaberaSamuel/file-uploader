import passport from "passport";
import { Router } from "express";
import { loginGetReqs } from "../controllers/loginController.js";
import { checkNotAuthenticated } from "../config/passportConfig.js";

const loginRouter = Router();
loginRouter.get("/", checkNotAuthenticated, loginGetReqs);
loginRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

export default loginRouter;
