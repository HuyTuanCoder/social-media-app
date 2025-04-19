const { createLogger, format, transports } = require('winston');
const path = require('path');

const logDirectory = path.resolve(__dirname, '../../logs');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'MM-DD-YYYY HH:mm:ss',
    }),
    format.errors({ stack: true }), // include stack trace in the log message
    format.splat(), // allow string placeholders in logging, e.g., logger.info('User %s logged in', username);
    format.json(),
    format.colorize({ all: true }),
  ),

  defaultMeta: { service: 'user-service' },

  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new transports.File({
      filename: `${logDirectory}/error.log`,
      level: 'error',
    }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new transports.File({ filename: `${logDirectory}/combined.log` }),
  ],

  exceptionHandlers: [
    // log uncaught exception events from the process
    new transports.File({ filename: `${logDirectory}/exceptions.log` }),
  ],

  rejectionHandlers: [
    // log unhandled Rejection events from the process
    new transports.File({ filename: `${logDirectory}/rejections.log` }),
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
