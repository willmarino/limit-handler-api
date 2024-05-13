const pug = require("pug");
const router = require("express").Router();
const usersService = require("../services/users");


/**
 * @description Users show route.
 */
router.get("/show", async (req, res, next) => {
    try{
        // const { orgName, projectName } = req.query;
        const userId = req.session.user.userId;
        const userInfo = await usersService.getUser(userId);

        const template = pug.compileFile("src/views/users/lobby.pug");
        const markup = template({ userInfo });

        res.status(200).send(markup);

    }catch(err){
        next(err);
    }
});


module.exports = router;