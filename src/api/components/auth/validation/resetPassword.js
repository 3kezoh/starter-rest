/**
 * Module dependencies
 */

const { StatusCodes } = require("http-status-codes");
const { default: validator } = require("validator");
const APIError = require("../../../utils/APIError");
const validationError = require("../../../utils/ValidationError");
const ErrorMessages = require("../../../utils/ErrorMessages");

module.exports = async ({ body }, res, next) => {
  try {
    const validationErrors = [];

    if (validator.isEmpty(body.passwordResetToken || "")) {
      validationErrors.push(
        validationError(
          "passwordResetToken",
          ErrorMessages.PASSWORD_RESET_TOKEN_EMPTY
        )
      );
    }

    if (!validator.isLength(body.password || "", { min: 8 }))
      validationErrors.push(
        validationError("password", ErrorMessages.PASSWORD_TOO_SHORT)
      );

    if (!validator.isLength(body.password || "", { max: 128 }))
      validationErrors.push(
        validationError("password", ErrorMessages.PASSWORD_TOO_LONG)
      );

    if (body.password !== body.confirmPassword)
      validationErrors.push(
        validationError("confirmPassword", ErrorMessages.PASSWORD_NOT_MATCH)
      );

    if (validationErrors.length) {
      throw new APIError({
        message: "Validation Error",
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: validationErrors,
      });
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
