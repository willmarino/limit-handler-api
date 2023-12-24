const { sequelize, models } = require("../db/connection");
const { logger } = require("../util/logger")


/**
 * @description Most likely will only be used for an admin panel or similar functionality,
 * end user will never see 'all subscriptions'.
 */
const getSubscriptions = async () => {
    const subscriptions = await models.Subscriptions.findAll();
    return subscriptions;
};



module.exports = {
    getSubscriptions
}