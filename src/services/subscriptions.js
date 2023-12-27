const { models } = require("../db/connection");


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