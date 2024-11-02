const { models } = require("../db/connection");


const getAll = async () => {
    const userRoles = await models.UserRoles.findAll();
    return userRoles;
}


module.exports = {
    getAll
}