const { models } = require("../db/connection");
const { logger } = require("../util/logger");


const getMembership = async (id) => {
    const membership = await models.Memberships.findOne({
        where: { id }
    });

    return membership;
}

module.exports = {
    getMembership
}