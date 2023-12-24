const { sequelize, models } = require("../db/connection");
const { logger } = require("../util/logger");


const getUser = async (id) => {
    const user = await models.Users.findOne({ where: { id } });
    return user;
}

module.exports = {
    getUser
};