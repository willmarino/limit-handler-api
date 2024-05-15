const { models } = require("../db/connection");


const getSubscriptionTiers = async () => {
    const subTiers = await models.SubscriptionTiers.findAll();
    return subTiers;
};



module.exports = {
    getSubscriptionTiers
}