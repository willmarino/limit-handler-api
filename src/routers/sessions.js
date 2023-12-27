const router = require("express").Router();
const sessionsService = require("../services/sessions");
const responseTemplates = require("../util/response_templates");


/**
 * @description Login route
 */
router.post("/create", async (req, res, next) => {
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




module.exports = router;