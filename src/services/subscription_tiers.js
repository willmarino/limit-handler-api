const { sequelize, models } = require("../db/connection");
const { logger } = require("../util/logger")


const getSubscriptionTiers = async () => {
    const subTiers = await models.SubscriptionTiers.findAll();
    return subTiers;
};



module.exports = {
    getSubscriptionTiers
}