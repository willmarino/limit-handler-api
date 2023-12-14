const { randomBytes, timingSafeEqual } = require("node:crypto");
const { models } = require("../db/connection");
const { logger } = require("../util/logger")
const ErrorWrapper = require("../util/error_wrapper");


/**
 * @description - Fetch all existing organization
 */
const getOrganizations = async () => {
    const organizations = await models.Organizations.findAll();
    return organizations;
}

/**
 * @description - Create a new organization
 * @param name - Name of the new organization
 */
const createOrganization = async (name) => {
    
    // Generate api key
    // let apiKey;
    // try{
    //     apiKey = await new Promise((resolve, reject) => {
    //         generateKey("hmac", { length: 24 }, (err, key) => {
    //             if(err) reject(err);
    //             resolve(key);
    //         });
    //     });
    // }catch(err){
    //     logger.info(err);
    //     // TODO ErrorWrapper should support passing in an error object
    //     throw new ErrorWrapper("Failed to create api key", 500);
    // }

    // Generate api key
    let apiKey;
    try{
        apiKey = await new Promise((resolve, reject) => {
            randomBytes(32, (err, buf) => {
                if(err) reject(err);
                resolve(buf.toString("hex"));
            })
        });
    }catch(err){
        logger.info(err);
        throw new ErrorWrapper("Failed to create api key", 500); // TODO ErrorWrapper should support passing in an error object
    }


    // Create organization db record
    const organization = await models.Organizations.create({
        apiKey,
        name
    });

    return organization;
}



module.exports = {
    getOrganizations,
    createOrganization
}