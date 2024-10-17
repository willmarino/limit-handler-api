const qs = require("node:querystring");
const pug = require("pug");
const router = require("express").Router();
const usersService = require("../services/users");
const sessionsService = require("../services/sessions");

/**
 * @description Logout
 */
router.post("/logout", async (req, res, next) => {
    try{
        req.session = null;
        res.redirect("/auth/login");
    }catch(err){
        next(err);
    }
})

/**
 * @description This handler runs for all /auth* routes,
 * ensures that users who are logged in can't navigate to a login or registration page.
 */
router.use("/", (req, res, next) => {

    const reqIsAuthenticated = Boolean(req.session.user);

    if(reqIsAuthenticated){
        res.redirect("/projects");
    }else{
        next();
    }

})


/**
 * @description Login GET FORM route
 */
router.get("/login", async(req, res, next) => {
    try{
        if(req.query.errMessage) res.set("User-Error", true); // Using this in place of 400 response, html won't render if I attach a 400 status

        const template = pug.compileFile("src/views/auth/login.pug");
        const markup = template({ ...req.query });
        
        res.set("HX-Push-Url", "/auth/login");
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
        res.redirect("/projects");
    
    }catch(err){

        const queryStringData = { errMessage: err.message };
        if(req.body.email) queryStringData.email = req.body.email;
        if(req.body.passwordInput) queryStringData.passwordInput = req.body.passwordInput;

        const queryString = qs.encode(queryStringData);
        res.redirect(`/auth/login?${queryString}`);

    }
});


/**
 * @description User registration GET FORM route.
 */
router.get("/register", async (req, res, next) => {
    try{
        if(req.query.errMessage) res.set("User-Error", true);

        const template = pug.compileFile("src/views/auth/register.pug");
        const markup = template({ ...req.query });
        
        res.set("HX-Push-Url", "/auth/register");
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
        res.redirect("/projects");

    }catch(err){

        const queryStringData = { errMessage: err.message };
        if(req.body.userName) queryStringData.userName = req.body.userName;
        if(req.body.email) queryStringData.email = req.body.email;
        if(req.body.passwordInput) queryStringData.passwordInput = req.body.passwordInput;

        const queryString = qs.encode(queryStringData);
        res.redirect(`/auth/register?${queryString}`);

    }
});


module.exports = router;