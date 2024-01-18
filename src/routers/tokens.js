const router = require("express").Router();
const tokensService = require("../services/tokens");
const responseTemplates = require("../util/response_templates");

/**
 * @description Generate, cache, and return an auth token for a user to use in subsequent requests
 * Returning orgId out of validateRefreshToken is a little awkward, should think of smoother way to pass info
 * Maybe just fetch in router? But as convention, don't want to make db queries from router functions, makes code harder to read
 */
router.post("/", async (req, res, next) => {
    try{

        const { refreshToken, orgIdentifier } = req.body;
        await tokensService.validateRefreshToken(refreshToken, orgIdentifier);

        const tokenResponse = await tokensService.generateAuthToken(orgIdentifier);
        await tokensService.cacheAuthToken(orgIdentifier, tokenResponse.authToken);

        res.status(200).send(
            responseTemplates.success(tokenResponse, "Success generating auth token")
        )

    }catch(err){
        next(err);
    }
});


module.exports = router;