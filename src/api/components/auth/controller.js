/**
 * Module dependencies
 */

const { StatusCodes } = require("http-status-codes");
const userService = require("../user/service");
const APIError = require("../../utils/APIError");
const RefreshToken = require("../refreshToken/RefreshToken");
const PasswordResetToken = require("../passwordResetToken/PasswordResetToken");
const ErrorMessages = require("../../utils/ErrorMessages");
const SuccessMessages = require("../../utils/SuccessMessages");

/**
 * Create a new user account with an email and password.
 * @async
 * @public
 * @route POST /auth/signup
 */

exports.signup = async ({ body }, res, next) => {
  try {
    const { email, password, name } = body;
    const existingUserDocument = await userService.findByEmail(email);
    if (existingUserDocument) {
      throw new APIError({
        message: ErrorMessages.EMAIL_USED,
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    const userDocument = await userService.create(email, password, name);
    const token = userDocument.token();
    const refreshToken = await RefreshToken.generate(userDocument._id);
    res.status(StatusCodes.CREATED);
    return res.json({
      message: SuccessMessages.SIGN_UP_SUCCESS,
      token,
      refreshToken,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Sign in a user using email and password
 * @async
 * @public
 * @route POST /auth/login
 */

exports.login = async ({ body }, res, next) => {
  try {
    const { email, password } = body;
    const userDocument = await userService.findByEmail(email);
    if (!userDocument) {
      throw new APIError({
        message: ErrorMessages.EMAIL_NOT_FOUND(email),
        status: StatusCodes.NOT_FOUND,
      });
    }
    if (!(await userDocument.passwordMatches(password))) {
      throw new APIError({
        message: ErrorMessages.PASSWORD_INVALID,
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    const token = userDocument.token();
    const refreshToken = await RefreshToken.generate(userDocument._id);
    return res.json({
      message: SuccessMessages.LOG_IN_SUCCESS,
      token,
      refreshToken,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Return a new jwt when given a valid refresh token
 * @async
 * @public
 * @route POST /auth/refresh-token
 */

exports.refresh = async ({ body }, res, next) => {
  try {
    const { refreshToken: value } = body;
    const refreshTokenDocument = await RefreshToken.findOne({ value });
    if (!refreshTokenDocument) {
      throw new APIError({
        message: "Please log in.",
        status: StatusCodes.NOT_FOUND,
      });
    }
    if (refreshTokenDocument.expiresIn < Date.now()) {
      throw new APIError({
        message: ErrorMessages.REFRESH_TOKEN_EXPIRED,
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    await refreshTokenDocument.populate("user").execPopulate();
    const token = refreshTokenDocument.user.token();
    const refreshToken = await RefreshToken.generate(
      refreshTokenDocument.user._id
    );
    return res.json({ token, refreshToken });
  } catch (err) {
    return next(err);
  }
};

/**
 * Send a password reset token to a user email.
 * @async
 * @public
 * @route POST /auth/send-password-reset
 */

exports.sendPasswordReset = async ({ body }, res, next) => {
  try {
    const { email } = body;
    const userDocument = await userService.findByEmail(email);
    if (!userDocument) {
      throw new APIError({
        message: ErrorMessages.EMAIL_NOT_FOUND(email),
        status: StatusCodes.NOT_FOUND,
      });
    }
    const passwordResetToken = await PasswordResetToken.generate(
      userDocument._id
    );
    return res.json({ passwordResetToken });
  } catch (err) {
    return next(err);
  }
};

/**
 * Reset a user password
 * @async
 * @public
 * @route /auth/reset-password
 */

exports.resetPassword = async ({ body }, res, next) => {
  try {
    const { password, passwordResetToken: value } = body;
    const passwordResetTokenDocument = await PasswordResetToken.findOne({
      value,
    });
    if (!passwordResetTokenDocument) {
      throw new APIError({ status: StatusCodes.NOT_FOUND });
    }
    if (passwordResetTokenDocument.expiresIn < Date.now()) {
      throw new APIError({
        message: ErrorMessages.PASSWORD_RESET_TOKEN_EXPIRED,
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    await passwordResetTokenDocument.populate("user").execPopulate();
    if (await passwordResetTokenDocument.user.passwordMatches(password)) {
      throw new APIError({
        message: ErrorMessages.PASSWORD_SAME,
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    passwordResetTokenDocument.user.password = password;
    await passwordResetTokenDocument.user.save();
    await PasswordResetToken.findOneAndRemove({ value });
    return res.json({ message: SuccessMessages.PASSWORD_UPDATED });
  } catch (err) {
    return next(err);
  }
};
