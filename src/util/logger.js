const winston = require('winston');


const logger = winston.createLogger({
    level: (process.env.NODE_ENV === "test")
        ? "crit"
        : (process.env.NODE_ENV === "development")
            ? "debug"
            : "info",

    // Use JSON formatting to be Datadog friendly
    format: (["test", "development"].includes(process.env.NODE_ENV))
        ? winston.format.combine( winston.format.colorize(), winston.format.simple() )
        : winston.format.json(),

    defaultMeta: { env: process.env.NODE_ENV },
});

logger.err = (msg, e, opts) => {
    opts = opts || {};

    if (process.env.NODE_ENV === "test") {
        console.warn(e);
    }

    logger.error(msg, Object.assign({
        message: e.message,
        stack: e.stack
    }, opts));
}

logger.add(new winston.transports.Console());

module.exports = {
    logger
};
