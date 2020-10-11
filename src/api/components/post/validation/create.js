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

    if (validator.isEmpty(body.author || "")) {
      validationErrors.push(
        validationError("author", ErrorMessages.AUTHOR_EMPTY)
      );
    }

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
