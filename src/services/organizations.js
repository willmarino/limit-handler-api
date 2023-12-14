const { models } = require("../db/connection");
const { logger } = require("../util/logger")
const cryptoHelpers = require("../heleprs/crypto");


/**
 * @description - Fetch all existing organizations.
 */
const getOrganizations = async () => {
    const organizations = await models.Organizations.findAll();
    return organizations;
}


/**
 * @description - Create a new organization given a name and a randomly generate api key.
 * @param name - Name of the new organization
 */
const createOrganization = async (name) => {
    
    // Generate new api key
    const apiKey = await cryptoHelpers.generateApiKey();

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