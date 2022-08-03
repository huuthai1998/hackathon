const morgan = require("morgan");
const logger = require("../utils/logger");

// Override the stream method
const stream = {
  // Use the http severity
  write: (message) => logger.http(message),
};

// Skip all the Morgan http log if not running in dev mode.
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

// Build the morgan middleware
const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  ":method :url :status :res[content-length] - :response-time ms",
  // Options: overwrite the stream and the skip logic.
  { stream, skip }
);

module.exports = morganMiddleware;