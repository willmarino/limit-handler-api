const pug = require("pug");
const router = require("express").Router();
const usersService = require("../services/users");


/**
 * @description Users show route.
 */
router.get("/show", async (req, res, next) => {
    try{
        const id = req.context.get("user").id;
        const user = await usersService.getUser(id);

        const template = pug.compileFile("src/views/users/lobby");
        const markup = template({ user });

        res.status(200).send(markup);

    }catch(err){
        next(err);
    }
});


module.exports = router;