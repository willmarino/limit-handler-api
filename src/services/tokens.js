const { models } = require("../db/connection");
const bcryptHelpers = require("../helpers/bcrypt");
const REDIS_WRAPPER = require("../util/redis_connection_wrapper");
const ErrorWrapper = require("../util/error_wrapper");


/**
 * @description Ensure refresh token is valid.
 * This isn't a middleware/helper function because refresh token auth will only ever happen on one route, and pretty infrequently.
 */
const validateRefreshToken = async (refreshTokenInput, orgIdentifier) => {
    const org = await models.Organizations.findOne({
        where: { identifier: orgIdentifier }
    });

    const isMatch = await bcryptHelpers(refreshTokenInput, org.refreshToken);
    if(isMatch){
        return org.id;
    }else{
        throw new ErrorWrapper("Invalid refresh token", 400);
    }
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
 * @param orgId - Organization id
 * @param authToken - Auth token which was just generated (and should be cached)
 */
const cacheAuthToken = async (orgId, authToken) => {
    await REDIS_WRAPPER.client.set(
        `authtoken:org:${orgId}`,
        JSON.stringify({
            authToken
        })
    );

    return;
}


module.exports = {
    validateRefreshToken,
    generateAuthToken,
    cacheAuthToken
}