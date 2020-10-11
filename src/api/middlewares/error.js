/**
 * Module dependencies.
 */

const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const APIError = require("../utils/APIError");
const { env } = require("../../config/globals");
const logger = require("../../config/logger");

/**
 * Error handler. Send stacktrace only during development
 * @public
 */

// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || getReasonPhrase(err.status),
    errors: err.errors,
    stack: err.stack,
  };
  if (env !== "development") delete response.stack;
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  return res.json(response);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */

const notFound = (req, res) => {
  const err = new APIError({ status: StatusCodes.NOT_FOUND });
  return handler(err, req, res);
};

module.exports = { handler, notFound };
