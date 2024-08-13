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
        const r = await organizationsService.getOrganization(req);

        const template = pug.compileFile("src/views/organizations/show.pug");
        const markup = template ({ ...r, user: req.session.user });

        res.set("HX-Push-Url", `/organizations/show/${req.params.id}`);
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});


/**
 * @descriptions Index route for user's organizations.
 */
router.get("/", async (req, res, next) => {
    try{
        const r = await organizationsService.getUserOrganizations(req);
        const template = pug.compileFile("src/views/organizations/index.pug");

        const markup = template({ ...r, user: req.session.user });

        let urlString = `/organizations?curPage=${r.curPage}`;
        if(r.searchTerm) urlString += `&searchTerm=${r.searchTerm}`;

        res.set("HX-Push-Url", urlString);
        res.status(200).send(markup);

    }catch(err){
        next(err);
    }
})



/**
 * @description Create org GET form route
 */
router.get("/new", async (req, res, next) => {
    try{
        const subTiers = await subscriptionTiersService.getSubscriptionTiers();

        const template = pug.compileFile("src/views/organizations/new.pug");
        const markup = template({
            subTiers,
            name: req.query.name,
            selectedSubTier: req.query.selectedSubTier,
            errMessage: req.query.errMessage,
            user: req.session.user,
            newOrgPage: true
        });

        const hxPushUrl = (Object.keys(req.query).length > 0)
            ? `/organizations/new?${qs.stringify(req.query)}`
            : "/organizations/new";

        res.set("HX-Push-Url", hxPushUrl);
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});


/**
 * @description Create route for making new organizations.
 */
router.post("/create", async (req, res, next) => {
    try{
        
        await organizationsService.createOrganization(req);
        res.redirect("/organizations");

    }catch(err){

        const queryStringData = { errMessage: err.message };
        if(req.body.name) queryStringData.name = req.body.name;
        if(req.body.selectedSubTier) queryStringData.selectedSubTier = req.body.selectedSubTier;

        const queryString = qs.stringify(queryStringData);
        res.redirect(`/organizations/new?${queryString}`);
    }
});


/**
 * @description Get route for individual organizations.
 * TODO: Build out subscriptions, subscription_tiers, memberships, etc before writing this
 * We will want to return all this information along with the individual organization
 */



module.exports = router;