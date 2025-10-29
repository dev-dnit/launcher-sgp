const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

const logDir = process.env.LOG_FOLDER;

if (!logDir) {
  throw new Error(
    "A variável de ambiente 'LOG_FOLDER' não está definida no arquivo .env."
  );
}

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "sgp-launcher-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(
      (info) =>
        `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message}`
    )
  ),
  transports: [new winston.transports.Console(), dailyRotateFileTransport],
});

module.exports = logger;
