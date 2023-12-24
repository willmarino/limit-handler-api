const router = require("express").Router();
const usersService = require("../services/users");
const responseTemplates = require("../util/response_templates");


/**
 * @description Users show route.
 */
router.get("/:id", async (req, res, next) => {
    try{
        const { userId } = req;
        const usersResponse = await usersService.getUser(userId);
        res.status(200).send(
            responseTemplates.success(usersResponse, "Successfully fetched user information")
        );
    }catch(err){
        next(err);
    }
});


module.exports = router;