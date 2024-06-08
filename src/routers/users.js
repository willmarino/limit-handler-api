const pug = require("pug");
const router = require("express").Router();
const usersService = require("../services/users");


/**
 * @description Users show route.
 */
router.get("/show", async (req, res, next) => {
    try{
        const userId = req.session.user.userId;
        const userInfo = await usersService.getUser(userId);

        const template = pug.compileFile("src/views/users/lobby.pug");
        const markup = template({
            userInfo,
            testVar: true,
            xVals: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
            yVals: [ 10, 4, 22, 3, 17, 11, 13, 17, 23, 29 ],
            message: req.query.message || ""
        });

        res.set("HX-Push-Url", "/users/show")
        res.status(200).send(markup);

    }catch(err){
        next(err);
    }
});

/**
 * @description Users profile router. Slightly different info than show page.
 */
router.get("/profile", async (req, res, next) => {
    try{
        const profileData = await usersService.getProfile(req);

        const template = pug.compileFile("src/views/users/profile_you.pug");
        const markup = template({ profileData });


        res.set("HX-Push-Url", "/users/profile")
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});

/**
 * @description
 */
router.get("/profile/organizations", async (req, res, next) => {
    try{
        const profileData = await usersService.getProfile(req);

        const template = pug.compileFile("src/views/users/profile_organizations.pug");
        const markup = template({ profileData });


        res.set("HX-Push-Url", "/users/profile/organizations")
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});

/**
 * @description Invitations menu
 */
router.get("/profile/invitations", async (req, res, next) => {
    try{
        const profileData = await usersService.getProfile(req);

        const template = pug.compileFile("src/views/users/profile_invitations.pug");
        const markup = template({ profileData });


        res.set("HX-Push-Url", "/users/profile/invitations")
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});


module.exports = router;