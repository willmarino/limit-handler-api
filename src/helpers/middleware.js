const { v4: uuidv4 } = require('uuid');
const { logger } = require("../util/logger");
const responseTemplates = require("../util/response_templates");


const addRequestContext = (req, res, next) => {
    const requestId = uuidv4();
    
    req.context.set("reqId", requestId);
    req.context.set("User-Agent", req.get("User-Agent"));

    Object.defineProperty(req, "logger", {
        value: logger.child({ requestId }),
        writable: false,
        enumerable: false
    });

    next("route");
};


const errorHandler = (err, req, res, next) => {

    req.logger.error({
        message: err.toString(),
        stack: err.stack,
    });
    
    res
        .status(err.statusCode || 500)
        .send(
            responseTemplates.error(
                {},
                (err.statusCode === 400)
                    ? err.message
                    : "System error, please contact an administrator",
            )
        );
};


module.exports = {
    addRequestContext,
    errorHandler
}