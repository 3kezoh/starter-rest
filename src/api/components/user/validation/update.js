/**
 * Module dependencies
 */

const { default: validator } = require("validator");
const { StatusCodes } = require("http-status-codes");
const APIError = require("../../../utils/APIError");
const validationError = require("../../../utils/ValidationError");

module.exports = async ({ body }, res, next) => {
  try {
    const validationErrors = [];

    if (!validator.isLength(body.name || "", { min: 3 }))
      validationErrors.push(
        validationError("name", "name should be at least 3 characters long")
      );

    if (!validator.isLength(body.name || "", { max: 32 }))
      validationErrors.push(
        validationError("name", "name can't exceed 32 characters")
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
