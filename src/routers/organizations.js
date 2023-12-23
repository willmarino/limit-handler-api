const router = require("express").Router();
const organizationsService = require("../services/organizations");
const responseTemplates = require("../util/response_templates");

/**
 * @description Index route for organizations. Not usable by users.
 */
router.get("/", async (req, res, next) => {
    try{
        const orgArr = await organizationsService.getOrganizations();
        res.status(200).send(
            responseTemplates.success( orgArr, "Success fetching organizations" )
        );
    }catch(err){
        next(err);
    }
});


/**
 * @description Create route for making new organizations.
 */
router.post("/create", async (req, res, next) => {
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