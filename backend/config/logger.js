const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = format;

// ─── Log format ────────────────────────────────────────────────────────────────
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// ─── Winston logger ────────────────────────────────────────────────────────────
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // capture full stack on Error objects
    logFormat
  ),
  transports: [
    // All HTTP requests (info+) → combined.log
    new transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      level: 'info',
    }),
    // Errors only → error.log
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
    }),
  ],
});

// Always print to console in containers so runtime failures are visible in docker logs
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.Console({
      level: 'warn',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      ),
    })
  );
} else {
  logger.add(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      ),
    })
  );
}

// ─── Morgan stream → Winston ───────────────────────────────────────────────────
// Morgan writes one line per request; we pipe it into winston at 'http' level
logger.stream = {
  write: (message) => logger.http(message.trimEnd()),
};

module.exports = logger;
