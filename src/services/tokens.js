const { models } = require("../db/connection");
const bcryptHelpers = require("../helpers/bcrypt");
const cryptoHelpers = require("../helpers/crypto")
const RED = require("../util/redis_connection_wrapper");
const ErrorWrapper = require("../util/error_wrapper");


/**
 * @description Ensure refresh token is valid.
 * This isn't a middleware/helper function because refresh token auth will only ever happen on one route, and pretty infrequently.
 */
const validateRefreshToken = async (refreshTokenInput, orgIdentifier) => {
    const org = await models.Organizations.findOne({
        where: { identifier: orgIdentifier }
    });
    if(!org) throw new ErrorWrapper("Invalid organization identifier", 400);

    const isMatch = await bcryptHelpers.compare(refreshTokenInput, org.refreshToken);
    if(isMatch){
        return org;
    }else{
        throw new ErrorWrapper("Invalid refresh token", 400);
    }
}


/**
 * @description Check for existing (org-scoped) auth token.
 * If none, generate random string, return it.
 * @param orgIdentifier - Organization identifier
 */
const generateAuthToken = async (orgIdentifier) => {
    let authToken;

    const existingAuthToken = await RED.client.get(`authtoken:org:${orgIdentifier}`);
    if(!existingAuthToken){
        authToken = await cryptoHelpers.generateRandomString(12);
    }else{
        authToken = existingAuthToken; // TODO Add token age check
    }

    return { authToken };
}


/**
 * @description Store auth token in cache at key of org id
 * @param orgIdentifier - Organization identifier
 * @param authToken - Auth token which was just generated (and should be cached)
 */
const cacheAuthToken = async (orgIdentifier, authToken) => {
    await RED.client.set(
        `authtoken:org:${orgIdentifier}`,
        authToken
    );

    return;
}


module.exports = {
    validateRefreshToken,
    generateAuthToken,
    cacheAuthToken
}