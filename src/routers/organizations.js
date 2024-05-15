const pug = require("pug");
const router = require("express").Router();
const organizationsService = require("../services/organizations");
const subscriptionTiersService = require("../services/subscription_tiers");
const responseTemplates = require("../util/response_templates");


/**
 * @description Show route for organizations.
 */
router.get("/show/:id", async (req, res, next) => {
    try{
        const { id: orgId } = req.params;
        const userId = req.session.user.userId;
        const organization = await organizationsService.getOrganization(orgId, userId);
        res.status(200).send(
            responseTemplates.success( organization, "Success fetching single organization" )
        );
    }catch(err){
        next(err);
    }
});


/**
 * @description Create org GET form route
 */
router.get("/create", async (req, res, next) => {
    try{
        const subTiers = await subscriptionTiersService.getSubscriptionTiers();

        const template = pug.compileFile("src/views/organizations/create.pug");
        const markup = template({ subTiers });

        res.set("HX-Push-Url", "/organizations/create");
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});


/**
 * @description Create route for making new organizations.
 */
router.post("/", async (req, res, next) => {
    try{
        const { name } = req.body;

        const org = await organizationsService.createOrganization(name, req.logger);
        res.status(200).send(
            responseTemplates.success( org, "Success creating organization" )
        );
    }catch(err){
        next(err);
    }
});


/**
 * @description Get route for individual organizations.
 * TODO: Build out subscriptions, subscription_tiers, memberships, etc before writing this
 * We will want to return all this information along with the individual organization
 */



module.exports = router;