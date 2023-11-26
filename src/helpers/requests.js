const { v4: uuidv4 } = require('uuid');
const { logger } = require("../util/logger");


async function addRequestContext(req, res, next){
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


module.exports = {
    addRequestContext
}