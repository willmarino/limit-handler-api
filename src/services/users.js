const { sequelize, models } = require("../db/connection");
const { logger } = require("../util/logger");


const getUser = async (userId) => {
    const user = await models.Users.findOne({ id: userId });
    return user;
}

module.exports = {
    getUser
};