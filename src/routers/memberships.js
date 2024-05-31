const router = require("express").Router();
const membershipsService = require("../services/memberships");
const responseTemplates = require("../util/response_templates");


/**
 * @description Memberships show route
 */
router.get("/:id", async (req, res, next) => {
    try{
        const { id } = req.params;
        const membership = await membershipsService.getMembership(id);
        res.status(200).send(
            responseTemplates.success(membership, "Success fetching membership")
        );
    }catch(err){
        next(err);
    }
});

/**
 * @description Memberships - Creation of invites - sends email to user, creates invitation.
 */



module.exports = router;