const router = require("express").Router();
const subTiersService = require("../services/subscription_tiers");
const responseTemplates = require("../util/response_templates");

/**
 * @description 
 */
router.get("/", async (req, res, next) => {
    try{
        const subTiers = await subTiersService.getSubscriptionTiers();
        res.status(200).send(
            responseTemplates.success( subTiers, "Success fetching subscription tiers" )
        );
    }catch(err){
        next(err);
    }
});



module.exports = router;

