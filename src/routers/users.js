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
            yVals: [ 10, 4, 22, 3, 17, 11, 13, 17, 23, 29 ]
        });

        res.set("HX-Push-Url", "/users/show")
        res.status(200).send(markup);

    }catch(err){
        next(err);
    }
});


module.exports = router;