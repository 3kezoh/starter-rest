/**
 * Module dependencies
 */

const { StatusCodes } = require("http-status-codes");
const { default: validator } = require("validator");
const APIError = require("../../../utils/APIError");
const validationError = require("../../../utils/ValidationError");
const { EMAIL_INVALID } = require("../../../utils/ErrorMessages");

module.exports = async ({ body }, res, next) => {
  try {
    const validationErrors = [];

    if (!validator.isEmail(body.email || ""))
      validationErrors.push(validationError("email", EMAIL_INVALID));

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
