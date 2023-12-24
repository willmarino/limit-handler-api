const router = require("express").Router();
const organizationsService = require("../services/organizations");
const responseTemplates = require("../util/response_templates");


/**
 * @description Show route for organizations.
 */
router.get("/:id", async (req, res, next) => {
    try{
        const { id } = req.params;
        const organization = await organizationsService.getOrganization(id);
        res.status(200).send(
            responseTemplates.success( organization, "Success fetching single organization" )
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