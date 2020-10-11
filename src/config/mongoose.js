/**
 * Module dependencies
 */

const Promise = require("bluebird");
const chalk = require("chalk");
const mongoose = require("mongoose");
const logger = require("./logger");
const { mongo, env } = require("./globals");

mongoose.Promise = Promise;

/**
 * Mongoose configurations.
 */

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

/**
 * Print mongoose logs in dev mode
 */

if (env === "development") mongoose.set("debug", true);

/**
 * Exit application on error.
 */

mongoose.connection.on("error", (err) => {
  logger.error(err);
  console.error(
    `${chalk.red(
      "✗"
    )} MongoDB connection error. Please make sur MongoDB is running.`
  );
  process.exit(-1);
});

/**
 * Connect to MongoDB
 */

exports.connect = async () => {
  await mongoose.connect(mongo.uri);
  if (env !== "test") logger.debug(`${chalk.green("✓")} MongoDB connected`);
  return mongoose.connection;
};
