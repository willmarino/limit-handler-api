const { v4: uuidv4 } = require('uuid');
const { models } = require("../db/connection");
const jwtHelpers = require("./jwt");
const ErrorWrapper = require("../util/error_wrapper");
const responseTemplates = require("../util/response_templates");
const { logger } = require("../util/logger");


/**
 * @description Add information to req.context which will help debugging and logging.
 */
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


/**
 * @description Check JWT's on incoming requests IF the user is using the website (not the actual rate limiting service).
 */
const authenticateJWT = async (req, res, next) => {

    const authExemptRouteMethodPairs = [
        ["POST", "/users"],
        ["POST", "/sessions"],
        ["POST", "/requests"]
    ]

    const routeRequiresJWTAuth = !authExemptRouteMethodPairs
        .some((rmp) => req.method === rmp[0] && req.path.startsWith(rmp[1]))

    if(!routeRequiresJWTAuth){
        next();

    }else{
        const token = req.headers.token;
        if(!token){
            throw new ErrorWrapper("Missing user authentication", 400);
        }

        let jwtEmail;
        try{
            const verifiedTokenData = jwtHelpers.verify(token);
            jwtEmail = verifiedTokenData.sub;
        }catch(err){
            throw new ErrorWrapper("Unable to authenticate user", 500);
        }

        const user = await models.Users.findOne({ where: { email: jwtEmail } });
        if(!user)
            throw new ErrorWrapper("Invalid user authentication", 400);

        req.context.set("user", user);
        next();
    }
}


/**
 * @description Check Api Key in headers of incoming request.
 */
const authenticateApiKey = async (req, res, next) => {
    const authedRouteMethodPairs = [
        "POST", "/requests"
    ];

    const routeRequiresApiKeyAuth = authedRouteMethodPairs
        .some((rmp) => req.method === rmp[0] && route.path.startsWith(rmp[1]));

    



}


/**
 * @description Catch errors thrown in previous middlewares,
 * send responses with appropriate information.
 */
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
    authenticateJWT,
    authenticateApiKey,
    errorHandler
}