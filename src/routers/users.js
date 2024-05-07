const qs = require("node:querystring");
const pug = require("pug");
const router = require("express").Router();
const usersService = require("../services/users");
const responseTemplates = require("../util/response_templates");


/**
 * @description Users show route.
 */
router.get("/show", async (req, res, next) => {
    try{
        const id = req.context.get("user").id;
        const usersResponse = await usersService.getUser(id);
        res.status(200).send(
            responseTemplates.success(usersResponse, "Successfully fetched user information")
        );
    }catch(err){
        console.log(err);
        next(err);
    }
});


/**
 * @description User registration GET FORM route.
 */
router.get("/register", async (req, res, next) => {
    try{
        const errMessage = req.query.errMessage || "";
        const status = (errMessage === "") ? 200 : 400;

        const template = pug.compileFile("src/views/users/register.pug");
        const markup = template({ errMessage });
        
        res.status(status).send(markup);
    }catch(err){
        next(err);
    }
})


/**
 * @description User registration route. Redirect to GET FORM route if registration fails.
 */
router.post("/register", async (req, res, next) => {
    try{
        const { userName, email, passwordInput } = req.body;
        const registrationResponse = await usersService.registerUser(userName, email, passwordInput);
        
        res.status(200).send(
            responseTemplates.success(registrationResponse, "User registered successfully")
        );

    }catch(err){
        res.redirect(`/users/register?errMessage=${err.message}`);
    }
});


module.exports = router;