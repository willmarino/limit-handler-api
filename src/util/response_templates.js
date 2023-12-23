/**
 * Just some helper functions which make sending data back to clients a bit simpler.
 * data, message, and statusCode parameters have default values which can all be overwritten.
 * One for success, one for error.
 */


const success = (data, message) => {
    return {
        data: data || {},
        message: message || "Request Successful"
    }
};


const error = (data, message) => {
    return {
        data: data || {},
        message: message || "Request Failed"
    }
};


module.exports = {
    success,
    error,
}