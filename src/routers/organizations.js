const qs = require("node:querystring");
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
        const markup = template({
            subTiers,
            name: req.query.name || "",
            selectedSubTier: req.query.selectedSubTier || "Basic" // Basic is default, it is the free plan
        });

        res.set("HX-Push-Url", `/organizations/create?${qs.stringify(req.query)}`);
        res.status(200).send(markup);
    }catch(err){
        next();
    }
});


/**
 * @description Create route for making new organizations.
 */
router.post("/", async (req, res, next) => {
    try{
        const org = await organizationsService.createOrganization(req);
        res.status(200).send(
            responseTemplates.success( org, "Success creating organization" )
        );
    }catch(err){

        const queryStringData = { errMessage: err.message };
        if(req.body.name) queryStringData.name = req.body.name;
        if(req.body.selectedSubTier) queryStringData.selectedSubTier = req.body.selectedSubTier;

        const queryString = qs.encode(queryStringData);
        res.redirect(`/organizations/create?${queryString}`);

        next(err);
    }
});


/**
 * @description Get route for individual organizations.
 * TODO: Build out subscriptions, subscription_tiers, memberships, etc before writing this
 * We will want to return all this information along with the individual organization
 */



module.exports = router;