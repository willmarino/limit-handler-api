/**
 * Just some helper functions which make sending data back to clients a bit simpler.
 * response, message, and statusCode parameters have default values which can all be overwritten.
 * One for success, one for error.
 */


const success = (response, message, statusCode) => {
    return {
        response: response || {},
        message: message || "Request Successful",
        statusCode: statusCode || 200
    }
};


const error = (response, message, statusCode) => {
    return {
        response: response || {},
        message: message || "Request Failed",
        statusCode: statusCode || 500
    }
};


module.exports = {
    success,
    error,
}