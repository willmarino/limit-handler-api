/**
 * @description Super simple function for adding error messages from router or service functions.
 */
const addMessage = async (req, type, message) => {
    req.session[`flash.${type}`] = message;
}


module.exports = {
    addMessage
}