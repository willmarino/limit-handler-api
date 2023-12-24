const { models } = require("../db/connection");


const getMembership = async (id) => {
    const membership = await models.Memberships.findOne({
        where: { id }
    });

    return membership;
}

module.exports = {
    getMembership
}