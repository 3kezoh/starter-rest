/**
 * Module dependencies.
 */

const http = require("http");
const debug = require("debug")("http");
const chalk = require("chalk");
const app = require("../config/express");
const mongoose = require("../config/mongoose");
const { port } = require("../config/globals");

/**
 * Store port in express app.
 */

app.set("port", port);

/**
 * Connect to MongoDB
 */

mongoose.connect();

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`${chalk.green("✓")} Listening on ${bind} in ${app.get("env")} mode`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
