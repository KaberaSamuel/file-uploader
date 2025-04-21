import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";

import { getUserByEmail, getUserById } from "../db.js";

async function authenticateUser(email, password, done) {
  const user = await getUserByEmail(email);

  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect User Password" });
    }
  } else {
    return done(null, false, { message: "Incorrect User Email" });
  }
}

passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  done(null, user);
});
