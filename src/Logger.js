const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const {createDirectory} = require('./FileHelper');


const logDir = path.join(__dirname, "../logs");


// Define log format
const logFormat = winston.format.printf(({timestamp, level, message}) => {
    return `[${timestamp}] [${level}] ${message}`;
});


// File transport (daily rotation)
const fileTransport = new winston.transports.DailyRotateFile({
    dirname: logDir,
    filename: "app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxFiles: "30d",
    level: "info",
    auditFile: null,
    format: winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        logFormat
    ),
});


// Console transport
const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        winston.format.colorize({all: false}), // color only the level
        winston.format.printf(({timestamp, level, message}) => {
            return `[${timestamp}] [${level}] ${message}`;
        })
    ),
});


// Create logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        logFormat
    ),
    transports: [fileTransport, consoleTransport],
    exitOnError: false,
});


createDirectory(logDir);

module.exports = logger;
