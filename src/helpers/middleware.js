const { v4: uuidv4 } = require('uuid');
const { models } = require("../db/connection");
const jwtHelpers = require("./jwt");
const RED = require("../util/redis_connection_wrapper");
const SimpleErrorWrapper = require("../util/error_wrapper");
const responseTemplates = require("../util/response_templates");
const { logger } = require("../util/logger");


/**
 * @description Add information to req.context which will help debugging and logging.
 * !Adding session info in sessionCookieValidation middleware instead
 */
// const addWebRequestContext = async (req, res, next) => {
//     const userId = req.session.userId;
//     const user = await usersService.getUserSimple(userId);
//     req.context.set("user", user);
    
//     const requestId = uuidv4();
//     req.context.set("reqId", requestId);

//     Object.defineProperty(req, "logger", {
//         value: logger.child({ requestId }),
//         writable: false,
//         enumerable: false
//     });

//     next("route");
// };


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
 * ! No longer using this to validate requests coming into the web API, now using cookie-session based auth, validated in the handler below
 */
const validateJWT = async (req, res, next) => {
    try{
        const token = req.headers.token;

        if(!token){
            throw new SimpleErrorWrapper("Missing user authentication", 400);
        }

        let verifiedTokenData;
        try{
            verifiedTokenData = jwtHelpers.verify(token);
        }catch(err){
            throw new SimpleErrorWrapper("Unable to authenticate user", 500);
        }

        const user = await models.Users.findOne({ where: { email: verifiedTokenData.sub } });
        if(!user){
            throw new SimpleErrorWrapper("Invalid user authentication", 400);
        }

        const passwordHashMatch = verifiedTokenData.pw === user.password;
        if(!passwordHashMatch){
            console.log(token)
            throw new SimpleErrorWrapper("Invalid user authentication", 400);
        }

        // Storing user info twice here, we can store sensitive info in context that we wouldn't want to put into session
        // req.session.user = user; // NEW
        req.context.set("user", user);
        next();
    }catch(err){
        next(err);
    }
}

/**
 * @description Validate requests coming into the web API based off of the info included in request session.
 * If information present is request session is insufficient or invalid, wipe session data and redirect user to the login page.
 * * Requires that user id, email, and hashed password are stored in session cookie, the insertion of which occurs during login
 */
const validateSessionCookie = async (req, res, next) => {
    try{
        if(!req.session.user.userId){
            throw new SimpleErrorWrapper("Unable to authenticate user info (3100)");
        }

        const user = await models.Users.findOne({ id: req.session.user.userId });
        if(!user){
            throw new SimpleErrorWrapper("Unable to authenticate user info (3101)");
        }

        if(user.email !== req.session.user.email){
            throw new SimpleErrorWrapper("Unable to authenticate user info (3102)");
        }

        if(user.password !== req.session.user.password){
            throw new SimpleErrorWrapper("Unable to authenticate user info (3103)");
        }

    }catch(err){
        req.session = null;
        res.redirect(`/auth/login?errMessage=${err.message}`);
    }
}


/**
 * @description Check auth token in headers of incoming request.
 */
const validateAuthToken = async (req, res, next) => {
    try{
        const authedRouteMethodPairs = [
            ["POST", "/requests"]
        ];
    
        const routeRequiresAuthToken = authedRouteMethodPairs
            .some((rmp) => req.method === rmp[0] && req.path.startsWith(rmp[1]));
    
        if(routeRequiresAuthToken){
            const { orgidentifier: orgIdentifierHeader, authtoken: authTokenHeader } = req.headers;

            const cachedAuthToken = await RED.client.get(`authtoken:org:${orgIdentifierHeader}`);
            
            const authTokenMatch = Boolean(authTokenHeader === cachedAuthToken);
            if(!authTokenMatch) throw new SimpleErrorWrapper("Invalid auth token, please double check your 'authtoken' header value", 401);
        }

        next();
    }catch(err){
        next(err);
    }

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
    validateJWT,
    validateSessionCookie,
    validateAuthToken,
    errorHandler
}