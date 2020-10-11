/**
 * Module dependencies.
 */

const compression = require("compression");
const cors = require("cors");
const errorHandler = require("errorhandler");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const strategies = require("./passport");
const { env } = require("./globals");
const error = require("../api/middlewares/error");

/**
 * Routers (route handlers).
 */

const userRouter = require("../api/components/user/router");
const authRouter = require("../api/components/auth/router");
const postRouter = require("../api/components/post/router");

/**
 * Create Express server.
 * @public
 */

const app = express();

/**
 * Express configuration.
 */

if (env !== "test") app.use(morgan("dev"));
app.use(express.json());
app.use(compression());
app.use(
  "/",
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
app.use(helmet());
app.use(cors());

/**
 * Enable passport authentication using JWT.
 */

app.use(passport.initialize());
passport.use("jwt", strategies.jwt);

/**
 * Primary routes.
 */

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);

/**
 * Error handlers.
 */

app.use(error.notFound);
app.use(error.handler);

if (env !== "production") {
  app.use(errorHandler());
}

module.exports = app;
