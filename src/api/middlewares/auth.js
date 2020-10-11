/**
 * Module dependencies
 */

const { promisify } = require("bluebird");
const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const APIError = require("../utils/APIError");

/**
 * Custom callback to handle authentication.
 * Using APIError instead of default behavior.
 * @private
 */

const handleJWT = (req, res, next) => async (err, user) => {
  try {
    if (err || !user) throw new APIError({ status: StatusCodes.UNAUTHORIZED });
    const logIn = promisify(req.logIn);
    await logIn(user, { session: false });
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Authenticate the user using jwt strategy.
 * @public
 */

exports.authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, handleJWT(req, res, next))(
    req,
    res,
    next
  );
};

/**
 * Authorize user or admin to access routes
 * @public
 */

exports.authorize = ({ user, params }, res, next) => {
  try {
    if (user.role !== "admin" && params._id !== user._id.toString()) {
      throw new APIError({
        message: "Access denied",
        status: StatusCodes.FORBIDDEN,
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
