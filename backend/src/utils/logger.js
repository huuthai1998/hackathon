const winston = require("winston");

const levels = {
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  verbose: 4, 
  debug: 5, 
  silly: 6
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "grey",
  debug: "blue",
  silly: "white",
};
winston.addColors(colors);

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "silly" : "warn";
};

const formatConsole = winston.format.combine(
  winston.format.label({ label: "[LOGGER]" }),
  winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => {
      if (info.stack) 
        return `${info.label} ${info.timestamp}  ${info.level}: ${info.message} \n Error Stack: ${info.stack}`;
      return `${info.label} ${info.timestamp}  ${info.level}: ${info.message}`;
    }
  )
);
const formatFile = winston.format.combine(
  winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss:ms" }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: formatConsole 
  }),
  new winston.transports.File({
    format: formatFile,
    filename: "logs/error.log",
    level: "error",
    format: formatFile
  }),
  new winston.transports.File({
    format: formatFile,
    filename: "./logs/combined.log",
    maxsize: 5242880, //5MB
    maxFiles: 5
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.errors({ stack: true }),
  transports,
});

module.exports = logger;
