

/**
 * @description Wraps the standard Error class,
 * adds the ability to attach a status code and error message to the error.
 * 
 * Based on the logic in the catch-all error handler in app.js,
 * when the status code param is not equal to 500, the error message is sent to the frontend,
 * and can be displayed to the user.
 * When the status code attached to an error is equal to 500, the default error message is sent to the frontend.
 * 
 * This gives flexibility in that we can either hide or show the cause of an error to a user.
 */
class SimpleErrorWrapper extends Error{
    constructor(message, statusCode){
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}



module.exports = SimpleErrorWrapper;