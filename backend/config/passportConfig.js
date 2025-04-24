import passport from "passport";
import { ExtractJwt, Strategy as JWTstrategy } from "passport-jwt";

import { jwtSecret } from "./envConfig.js";
import { getUserById } from "../db.js";

passport.use(
  new JWTstrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },

    async (payload, done) => {
      try {
        const user = await getUserById(payload.id);
        if (user) return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
