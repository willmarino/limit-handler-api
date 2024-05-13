const pug = require("pug");
const router = require("express").Router();
const usersService = require("../services/users");
const sessionsService = require("../services/sessions");


/**
 * @description This handler runs for all /auth* routes,
 * ensures that users who are logged in can't navigate to a login or registration page.
 */
router.use("/", (req, res, next) => {

    const reqIsAuthenticated = Boolean(req.session.user);

    if(reqIsAuthenticated){
        res.redirect("/main/lobby");
    }else{
        next();
    }

})


/**
 * @description Login GET FORM route
 */
router.get("/login", async(req, res, next) => {
    try{
        const errMessage = req.query.errMessage || "";
        if(errMessage) res.set("User-Error", true); // Using this in place of 400 response, html won't render if I attach a 400 status

        const template = pug.compileFile("src/views/auth/login.pug");
        const markup = template({ errMessage });
        
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
})


/**
 * @description Login
 */
router.post("/login", async (req, res, next) => {
    try{
        await sessionsService.login(req);
        res.redirect("/users/show");
    }catch(err){
        res.redirect(`/auth/login?errMessage=${err.message}`);
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
        if(errMessage) res.set("User-Error", true);

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
        await usersService.registerUser(req);
        res.redirect("/users/show");
    }catch(err){
        res.redirect(`/auth/register?errMessage=${err.message}`);
    }
});


module.exports = router;