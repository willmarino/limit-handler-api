const router = require("express").Router();
const usersService = require("../services/users");
const responseTemplates = require("../util/response_templates");


/**
 * @description Users show route.
 */
router.get("/:id", async (req, res, next) => {
    try{
        const { id } = req.params;
        const usersResponse = await usersService.getUser(id);
        res.status(200).send(
            responseTemplates.success(usersResponse, "Successfully fetched user information")
        );
    }catch(err){
        console.log(err);
        next(err);
    }
});


module.exports = router;