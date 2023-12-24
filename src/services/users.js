const { models } = require("../db/connection");


/**
 * @description Fetch a user
 */
const getUser = async (id) => {
    const user = await models.Users.findOne({ where: { id } });
    return user;
}

module.exports = {
    getUser
};