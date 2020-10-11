/**
 * Module dependencies.
 */

const { StatusCodes } = require("http-status-codes");
const ExtendableError = require("./ExtendableError");

/**
 * Class representing an API error.
 * @extends ExtendableError
 */

class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message
   * @param {number} status
   * @param {boolean} isPublic
   */

  constructor({
    message,
    errors,
    stack,
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    isPublic = false,
  }) {
    super({ message, errors, status, isPublic, stack });
  }
}

module.exports = APIError;
