import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import "../config/passportConfig.js";
import {
  insertIntoUsers,
  insertIntoFolders,
  getUserByUsername,
  getUserById,
  getFolders,
} from "../db.js";
import { jwtSecret } from "../config/envConfig.js";

const authRouter = Router();
const { sign, verify } = jwt;

function formatDate() {
  const time = Date.now();
  let date = new Date(time);
  date = date.toDateString();
  const dateArray = date.split(" ").splice(1);
  dateArray[1] += ",";
  date = dateArray.join(" ");

  return date;
}

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
  const user = req.user;
  user.folders = await getFolders();
  res.status(200).json({ user });
});

authRouter.post("/folder", async (req, res, next) => {
  try {
    const { folder } = req.body;
    const date = formatDate();
    await insertIntoFolders(folder, date);
    res.end();
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(400).json({ message: "incorrect username" });

    // check if password is correct
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "incorrect password" });

    // generate access token
    const accessToken = sign(
      {
        id: user.id,
      },
      jwtSecret,
      { expiresIn: "30d" }
    );

    res.cookie("token", accessToken, { httpOnly: true });

    // returning authenticated user
    return res.json({ user });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password1 } = req.body;
    const hashedPassword = await bcrypt.hash(password1, 10);
    await insertIntoUsers(username, hashedPassword);
    res.end();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

authRouter.get("/logout", (req, res, next) => {
  try {
    // Clearing JWT cookie
    res.cookie("token", null);
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

export default authRouter;
