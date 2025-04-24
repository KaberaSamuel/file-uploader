import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import "./config/passportConfig.js";
import { insertIntoUsers, getUserByEmail, getUserById } from "./db.js";
import { jwtSecret } from "./config/envConfig.js";

const authRouter = Router();
const { sign, verify } = jwt;

function authenticateToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (token == null) return res.status(400).json({ message: "no token" });

    verify(token, jwtSecret, async (err, payload) => {
      if (err) return res.status(401).json({ message: "invalid token" });
      const user = await getUserById(payload.id);
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
}

authRouter.get("/dashboard", authenticateToken, async (req, res) => {
  res.status(200).json({ user: req.user });
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "incorrect email" });

    // check if password is correct
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "incorrect password" });

    // generate access token
    const accessToken = sign(
      {
        id: user.id,
      },
      jwtSecret,
      { expiresIn: "1m" }
    );

    res.cookie("token", accessToken, { httpOnly: true });
    return res.end();
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const { fullname, email, password1 } = req.body;
    const hashedPassword = await bcrypt.hash(password1, 10);
    await insertIntoUsers(fullname, email, hashedPassword);
    res.end();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default authRouter;
