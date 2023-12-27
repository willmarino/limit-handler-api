const { models } = require("../db/connection");
const cryptoHelpers = require("../helpers/crypto");

/**
 * @description Get organization by id.
 */
const getOrganization = async (id) => {
    const organization = await models.Organizations.findOne({
        where: { id },
        include: [
            {
                model: models.Memberships,
                as: "memberships",
                include: [
                    {
                        model: models.Users,
                        as: "user"
                    }
                ]
            }
        ]
    });
    return organization;
}


/**
 * @description - Create a new organization given a name and a randomly generate api key.
 * @param name - Name of the new organization
 */
const createOrganization = async (name, reqLogger) => {
    
    // Generate new api key
    const apiKey = await cryptoHelpers.generateApiKey(reqLogger);

    // Create organization db record
    const organization = await models.Organizations.create({
        apiKey,
        name
    });

    await organization.reload();

    return organization;
};





module.exports = {
    getOrganization,
    createOrganization
}