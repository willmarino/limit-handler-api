const { randomBytes, timingSafeEqual } = require("node:crypto");
const ErrorWrapper = require("../util/error_wrapper");

/**
 * @description Generate an API Key for a new organization
 * @param numBytes - Byte length of string to be generated
 */
const generateRandomString = async (numBytes) => {
    
    const randomString = await new Promise((resolve, reject) => {
        randomBytes(numBytes, (err, buf) => {
            if(err) reject(err);
            resolve(buf.toString("hex"));
        })
    });
    
    return randomString;
}


/**
 * @description Secure compare func used to validate api keys embedded in incoming requests.
 * Do I need this for any reason if I already have bcrypt compare???
 * @param input - User input which we want to test
 * @param hash - Hash of the actual value we are trying to match to
 */
const secureCompare = async (input, hash) => {
    const inputBuf = Buffer.from(input, "utf8");
    const hashBuf = Buffer.from(hash, "utf8");

    const isHashValid = timingSafeEqual(inputBuf, hashBuf);
    return isHashValid;

}

module.exports = {
    generateRandomString,
    secureCompare
}