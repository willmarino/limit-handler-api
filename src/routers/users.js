const router = require("express").Router();
const usersService = require("../services/users");
const responseTemplates = require("../util/response_templates");


/**
 * @description Users show route.
 */
router.get("/", async (req, res, next) => {
    try{
        const id = req.context.get("user").id;
        const usersResponse = await usersService.getUser(id);
        res.status(200).send(
            responseTemplates.success(usersResponse, "Successfully fetched user information")
        );
    }catch(err){
        next(err);
    }
});

/**
 * @description User registration route
 */
router.post("/", async (req, res, next) => {
    try{
        const { userName, email, passwordInput } = req.body;
        const registrationResponse = await usersService.registerUser(userName, email, passwordInput);
        
        res.status(200).send(
            responseTemplates.success(registrationResponse, "User registered successfully")
        );

    }catch(err){
        next(err);
    }
});


module.exports = router;