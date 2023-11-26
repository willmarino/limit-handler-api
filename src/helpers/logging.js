const morgan = require("morgan");


/**
 * @description Middleware function for logging processing of requests with requests.
 */
function morganLog(req, res, next) {
    return morgan(
        ':method :url :status :res[content-length] :response-time ms', {
            stream: {
                write: ( message ) => {
                    const [ method, url, status, responseLength, responseTime ] = message.split(' ');
                    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

                    if(url === "/server_health/check") return;

                    req.logger.log({
                        message: `request completed for ${url} in ${responseTime}ms`,
                        level, method, url, status, responseLength, responseTime
                    })
                }
            }
        }
    )(req, res, next)
};

module.exports = {
    morganLog
}