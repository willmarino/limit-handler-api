const { models } = require("../db/connection");
const ErrorWrapper = require("../util/error_wrapper");



const getOrganizations = async () => {
    const organizations = await models.Organizations.findAll();
    return organizations;
}



module.exports = {
    getOrganizations
}