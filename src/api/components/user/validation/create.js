/**
 * Module dependencies
 */

const { default: validator } = require("validator");
const { StatusCodes } = require("http-status-codes");
const APIError = require("../../../utils/APIError");
const validationError = require("../../../utils/ValidationError");
const ErrorMessages = require("../../../utils/ErrorMessages");

module.exports = async ({ body }, res, next) => {
  try {
    const validationErrors = [];

    if (!validator.isEmail(body.email || ""))
      validationErrors.push(
        validationError("email", ErrorMessages.EMAIL_INVALID)
      );

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

    if (!validator.isLength(body.name || "", { min: 3 }))
      validationErrors.push(
        validationError("name", ErrorMessages.NAME_TOO_SHORT)
      );

    if (!validator.isLength(body.name || "", { max: 32 }))
      validationErrors.push(
        validationError("name", ErrorMessages.NAME_TOO_LONG)
      );

    if (validator.isEmpty(body.role || ""))
      validationErrors.push(validationError("role", ErrorMessages.ROLE_EMPTY));
    else if (body.role !== "admin" && body.role !== "user")
      validationErrors.push(validationError("role", ErrorMessages.ROLE_VALUE));

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
