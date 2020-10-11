/**
 * Module dependencies
 */

const chalk = require("chalk");
const dotenv = require("dotenv");
const fs = require("fs");
const logger = require("./logger");

/**
 * Load environment variables from .env or .env.example.
 */

if (fs.existsSync(".env")) {
  logger.debug("Using .env file to supply environment variables");
  dotenv.config({ path: ".env" });
} else if (fs.existsSync(".env.example")) {
  if (process.env.NODE_ENV === "development")
    logger.debug("Using .env.example file to supply environment variables");
  dotenv.config({ path: ".env.example" });
} else {
  logger.error(new Error(".env or .env.example missing"));
  console.error(`${chalk.red("✗")} .env or .env.example missing`);
}

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: parseInt(process.env.JWT_EXPIRATION, 10),
  refreshTokenExpiration: parseInt(process.env.REFRESH_TOKEN_EXPIRATION, 10),
  passwordResetTokenExpiration: parseInt(
    process.env.PASSWORD_RESET_TOKEN_EXPIRATION,
    10
  ),
  mongo: {
    uri:
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI
        : process.env.MONGODB_URI_LOCAL,
  },
};
