const { models } = require("../db/connection");


const getSubscriptionTiers = async () => {
    const subTiers = await models.SubscriptionTiers.findAll({
        // includes: [{
        //     model: 
        // }]
    });
    return subTiers;
};



module.exports = {
    getSubscriptionTiers
}