const { models } = require("../db/connection");



const getOrganizations = async () => {
    const organizations = await models.Organizations.findAll();
    return organizations;
}



module.exports = {
    getOrganizations
}