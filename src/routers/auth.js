const router = require("express").Router();
const authService = require("../services/auth");
const responseTemplates = require("../util/response_templates");


/**
 * @description Registration route
 */
router.post("/register", async (req, res, next) => {
    try{
        const { userName, email, passwordInput } = req.body;
        const registrationResponse = await authService.registerUser(userName, email, passwordInput);
        
        res.status(200).send(
            responseTemplates.success(registrationResponse, "User registered successfully")
        );

    }catch(err){
        next(err);
    }
});




module.exports = router;