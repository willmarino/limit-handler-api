const { randomBytes, timingSafeEqual } = require("node:crypto");
const ErrorWrapper = require("../util/error_wrapper");

/**
 * @description Generate an API Key for a new organization
 * @param reqLogger - Request logger
 */
const generateApiKey = async (reqLogger) => {
    
    let apiKey;
    try{
        apiKey = await new Promise((resolve, reject) => {
            randomBytes(18, (err, buf) => {
                if(err) reject(err);
                resolve(buf.toString("hex"));
            })
        });
    }catch(err){
        reqLogger.error("Failed to create api key", err);
        throw new ErrorWrapper("Failed to create api key", 500); // TODO ErrorWrapper should support passing in an error object
    }
    
    return apiKey;
}


/**
 * @description Secure compare func used to validate api keys embedded in incoming requests
 * @param apiKeyInput - What the user has sent as their api key
 * @param apiKey - What the organization's api key actually is, as stored in our database
 */
const secureCompare = async (apiKeyInput, apiKey) => {
    const apiKeyInputBuf = Buffer.from(apiKeyInput, "utf8");
    const apiKeyBuf = Buffer.from(apiKey, "utf8");

    const isApiKeyValid = timingSafeEqual(apiKeyInputBuf, apiKeyBuf);
    return isApiKeyValid;

}

module.exports = {
    generateApiKey,
    secureCompare
}