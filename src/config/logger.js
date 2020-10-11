/**
 * Module dependencies.
 */
const winston = require("winston");

/**
 * Instantiate logger.
 */

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV === "development") {
  logger.debug("Logging initialized at debug level");
}

module.exports = logger;
