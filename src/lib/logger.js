import path from "path";
import fs from "fs";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

/**
 * Singleton Logger class using Winston for console and file logging.
 */
export class Logger {
  /** @type {Logger} */
  static #instance;

  /** @type {winston.Logger} */
  #logger;

  /** @type {string} */
  #logsDir = path.resolve("logs");

  /** @type {Object.<string, string>} */
  #customColors = {
    error: "red",
    warn: "yellow",
    info: "blue",
    debug: "green",
  };

  constructor() {
    // Prevent direct instantiation to enforce Singleton pattern
    if (Logger.#instance) {
      throw new Error("Use Logger.getInstance() instead of new.");
    }

    if (!fs.existsSync(this.#logsDir)) {
      fs.mkdirSync(this.#logsDir, { recursive: true });
    }

    winston.addColors(this.#customColors);

    this.#logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.printf(({ timestamp, level, message }) => {
              return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            }),
            winston.format.colorize({ all: true }),
          ),
        }),

        ...(process.env.NODE_ENV === "production"
          ? [
              new DailyRotateFile({
                filename: path.join(this.#logsDir, "site-%DATE%.log"),
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: "20m", // Winston Daily Rotate accepts '20m' as 20MB
                maxFiles: 14,
                level: "info",
              }),
            ]
          : []),
      ],
    });
  }

  /**
   * Returns the singleton instance of the Logger.
   * @returns {Logger}
   */
  static getInstance() {
    if (!Logger.#instance) {
      Logger.#instance = new Logger();
    }
    return Logger.#instance;
  }

  /**
   * Logs an info message.
   * @param {string} message
   */
  info(message) {
    this.#logger.info(message);
  }

  /**
   * Logs an error message with optional error details.
   * @param {string} message
   * @param {any} [error]
   */
  error(message, error) {
    if (error) {
      if (error instanceof Error) {
        this.#logger.error(
          `${message}\nError: ${error.message}\nStack Trace: ${error.stack}`,
        );
        return;
      }
      this.#logger.error(`${message}\nError: ${error.toString()}`);
    } else {
      this.#logger.error(message);
    }
  }

  /**
   * Logs a warning message.
   * @param {string} message
   */
  warn(message) {
    this.#logger.warn(message);
  }

  /**
   * Logs a debug message.
   * @param {string} message
   */
  debug(message) {
    this.#logger.debug(message);
  }
}

// Export the singleton instance
const logger = Logger.getInstance();
export default logger;
