/**
 * Just some helper functions which make sending data back to clients a bit simpler.
 * data, message, and statusCode parameters have default values which can all be overwritten.
 * One for success, one for error.
 */


const success = (data, message, statusCode) => {
    return {
        data: data || {},
        message: message || "Request Successful",
        statusCode: statusCode || 200
    }
};


const error = (data, message, statusCode) => {
    return {
        data: data || {},
        message: message || "Request Failed",
        statusCode: statusCode || 500
    }
};


module.exports = {
    success,
    error,
}