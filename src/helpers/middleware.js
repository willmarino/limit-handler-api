const { v4: uuidv4 } = require('uuid');
const { models } = require("../db/connection");
const RED = require("../util/redis_connection_wrapper");
const SimpleErrorWrapper = require("../util/error_wrapper");
const responseTemplates = require("../util/response_templates");
const { logger } = require("../util/logger");


/**
 * @description Add information to req.context which will help debugging and logging.
 */
const addRequestContext = (req, res, next) => {

    Object.defineProperty(req, "logger", {
        value: logger.child({ requestId: uuidv4() }),
        writable: false,
        enumerable: false
    });

    next();
};

/**
 * @description Validate requests coming into the web API based off of the info included in request session.
 * If information present is request session is insufficient or invalid, wipe session data and redirect user to the login page.
 * * Requires that user id, email, and hashed password are stored in session cookie, the insertion of which occurs during login
 */
const validateSessionCookie = async (req, res, next) => {
    try{

        if(!req.session.user){
            throw new SimpleErrorWrapper("Unable to authenticate user info (2998)");
        }

        if(!req.session.user.userId){
            throw new SimpleErrorWrapper("Unable to authenticate user info (3100)");
        }

        const user = await models.Users.findOne({ where: { id: req.session.user.userId } });
        if(!user){
            throw new SimpleErrorWrapper("Unable to authenticate user info (3101)");
        }

        if(user.email !== req.session.user.email){
            throw new SimpleErrorWrapper("Unable to authenticate user info (3102)");
        }

        if(user.password !== req.session.user.password){
            throw new SimpleErrorWrapper("Unable to authenticate user info (3103)");
        }

        next();

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
// TODO Change this error handler so that it sends the user an html doc.
// TODO what should be on it? It would be great to be able to send a user back to their previous page along with an error message, is this possible?
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
    validateSessionCookie,
    validateAuthToken,
    errorHandler
}