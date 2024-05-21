const pug = require("pug");
const qs = require("node:querystring");
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
        const markup = template({
            subTiers,
            name: req.query.name,
            selectedSubTier: req.query.selectedSubTier,
            errMessage: req.query.errMessage
        });

        const hxPushUrl = (Object.keys(req.query).length > 0)
            ? `/organizations/create?${qs.stringify(req.query)}`
            : "/organizations/create";

        res.set("HX-Push-Url", hxPushUrl);
        res.status(200).send(markup);
    }catch(err){
        next();
    }
});


/**
 * @description Create route for making new organizations.
 */
router.post("/create", async (req, res, next) => {
    try{
        
        await organizationsService.createOrganization(req);
        res.redirect("/users/show");

    }catch(err){

        const queryStringData = { errMessage: err.message };
        if(req.body.name) queryStringData.name = req.body.name;
        if(req.body.selectedSubTier) queryStringData.selectedSubTier = req.body.selectedSubTier;

        const queryString = qs.stringify(queryStringData);
        res.redirect(`/organizations/create?${queryString}`);
    }
});


/**
 * @description Get route for individual organizations.
 * TODO: Build out subscriptions, subscription_tiers, memberships, etc before writing this
 * We will want to return all this information along with the individual organization
 */



module.exports = router;