import bcrypt from "bcrypt";
import express from "express";
import session from "express-session";
import cors from "cors";

import { insertIntoUsers } from "./db.js";
import passport from "passport";
import "./config/passportConfig.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "I like anime",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // Login failed — send error message
      return res.status(401).json({ message: info.message });
    }

    // Log the user in manually
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "logged in successfully", user });
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

// error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "internal server error" });
});

app.listen(3000, () => {
  console.log("server open");
});
