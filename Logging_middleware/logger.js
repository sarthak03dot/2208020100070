const winston = require("winston");
require("winston-daily-rotate-file");

const transport = new winston.transports.DailyRotateFile({
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [transport],
});

// Create a middleware function to log requests
const logMiddleware = (req, res, next) => {
  // Log the request details
  logger.info({
    message: "API Request",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: req.body,
  });
  next();
};

module.exports = {
  logger,
  logMiddleware,
};
