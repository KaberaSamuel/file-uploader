import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";

import { getUserByEmail, getUserById } from "../db/queries.js";

async function authenticateUser(email, password, done) {
  const user = await getUserByEmail(email);

  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  } else {
    return done(null, false, { message: "User email incorrect" });
  }
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  done(null, user);
});

export { checkAuthenticated, checkNotAuthenticated };
