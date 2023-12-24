const router = require("express").Router();
const subscriptionsService = require("../services/subscriptions");
const responseTemplates = require("../util/response_templates");

/**
 * @description Fetch all subscriptions (groups of people 'subscribing' to this product)
 */
router.get("/", async (req, res, next) => {
    const subscriptions = await subscriptionsService.getSubscriptions();
    res.status(200).send(
        responseTemplates.success( subscriptions, "Success fetching subscriptions" )
    );
});



module.exports = router;