import path from "node:path";
import express from "express";
import session from "express-session";
import flash from "express-flash";

import passport from "passport";
import "./config/passportConfig.js";

import homeRouter from "./routers/homeRouter.js";
import loginRouter from "./routers/loginRouter.js";
import registerRouter from "./routers/registerRouter.js";
import logoutRouter from "./routers/logoutRouter.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join("./", "views"));

app.use("/public", express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/", homeRouter);

app.listen(3000, () => {
  console.log("Server Open");
});
