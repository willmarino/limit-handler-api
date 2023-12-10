const { v4: uuidv4 } = require('uuid');
const { logger } = require("../util/logger");
const responseTemplates = require("../util/response_templates");


function addRequestContext(req, res, next){
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


function errorHandler(err, req, res, next){

    req.logger.error({
        message: err.toString(),
        stack: err.stack,
        statusCode: err.statusCode || 500
    });
    
    res
        .status(err.statusCode || 500)
        .send(
            responseTemplates.error(
                {},
                (err.statusCode === 400)
                    ? err.message
                    : "System error, please contact an administrator",
                err.statusCode || 500,
            )
        )
};


module.exports = {
    addRequestContext,
    errorHandler
}