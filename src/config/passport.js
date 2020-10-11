/**
 * Module dependencies
 */

const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { jwtSecret } = require("./globals");

/**
 * User Service
 */

const userService = require("../api/components/user/service");

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verify = async (payload, done) => {
  try {
    const userDocument = await userService.find(payload.sub);
    if (userDocument) return done(null, userDocument);
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, verify);
