const router = require("express").Router();
const tokensService = require("../services/tokens");
const responseTemplates = require("../util/response_templates");

/**
 * @description Generate, cache, and return an auth token for a user to use in subsequent requests
 */
router.post("/", async (req, res, next) => {
    try{
        const { refreshToken, orgIdentifier } = req.body;
        const tokenResponse = await tokensService.generateAuthToken(refreshToken, orgIdentifier);
        await tokensService.cacheAuthToken(tokenResponse.authToken);
        res.status(200).send(
            responseTemplates(tokenResponse, "Success generating auth token")
        )
    }catch(err){
        next(err);
    }
});


module.exports = router;