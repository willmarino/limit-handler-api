const { models } = require("../db/connection");
const cryptoHelpers = require("../helpers/crypto");
const REDIS_WRAPPER = require("../util/redis_connection_wrapper");


/**
 * @description Ensure refresh token is valid.
 * This isn't a middleware/helper function because refresh token auth will only ever happen on one route, and pretty infrequently.
 */
const validateRefreshToken = async (refreshToken, ) => {

}



/**
 * @description Generate random string, return it.
 */
const generateAuthToken = async () => {
    const authToken = await generateRandomString(12);
    return { authToken };
}


/**
 * @description Store auth token in cache at key of org id
 */
const cacheAuthToken = async () => {
    // await REDIS_WRAPPER.client.set(
    //     `authtoken:org:${}`
    //     JSON.stringify({
    //         authToken
    //     })
    // )
}


module.exports = {
    validateRefreshToken,
    generateAuthToken,
    cacheAuthToken
}