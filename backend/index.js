import { nodeEnv, sessionSecret } from "./config/envConfig.js";

import bcrypt, { compareSync } from "bcrypt";
import express from "express";
import session from "express-session";
import cors from "cors";

import { insertIntoUsers } from "./db.js";
import passport from "passport";
import startPassportInstance from "./config/passportConfig.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (nodeEnv === "development") {
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
} else {
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  );
}

app.use(passport.initialize());
app.use(passport.session());
startPassportInstance();

// error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "internal server error" });
});

app.get("/home", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.json(req.user);
  } else {
    res.status(401).end();
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      if (req.isAuthenticated()) {
        console.log(req.user);
      }
      return res.status(200).json({ user });
    });
  })(req, res, next);
});

app.post("/addUser", async (req, res) => {
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

app.listen(3000, () => {
  console.log("server open");
});
