const pug = require("pug");
const router = require("express").Router();
const usersService = require("../services/users");
const sessionsService = require("../services/sessions");
const responseTemplates = require("../util/response_templates");


// router.use("/", (req, res, next) => {

//     const reqIsAuthenticated = Boolean(req.session.user);

//     if(reqIsAuthenticated){
//         res.redirect("/main/lobby");
//     }

// })


/**
 * @description Login
 */
router.post("/login", async (req, res, next) => {
    try{
        const { email, passwordInput } = req.body;
        const loginResponse = await sessionsService.login(email, passwordInput);
        res.status(200).send(
            responseTemplates.success(loginResponse, "Login successful")
        )
    }catch(err){
        next(err);
    }
});


/**
 * @description Logout
 */


/**
 * @description User registration GET FORM route.
 */
router.get("/register", async (req, res, next) => {
    try{
        const errMessage = req.query.errMessage || "";
        if(errMessage) res.set("User-Error", true); // Using this in place of 400 response, html won't render if I attach a 400 status

        const template = pug.compileFile("src/views/auth/register.pug");
        const markup = template({ errMessage });
        
        res.status(200).send(markup);
        
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
        const user = await usersService.registerUser(userName, email, passwordInput);
        
        const template = pug.compileFile("src/views/general/lobby.pug");
        const markup = template({ userName: user.userName });

        res.status(200).send(markup);

    }catch(err){
        res.redirect(`/auth/register?errMessage=${err.message}`);
    }
});


module.exports = router;