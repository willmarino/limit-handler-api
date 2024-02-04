const router = require("express").Router();
const requestsService = require("../services/requests");
const responseTemplates = require("../util/response_templates");


/**
 * @description This is the route which is hit when a user makes a request to a third party API.
 * Pull the request timestamp out of body data (set by the frontend wrapper lib),
 * scan the redis storage of previous request timestamps,
 * and determine how long the frontend wrapper lib should force the user to wait (sleep)
 * before hitting the third party API.
 * Send the sleep ms count back as response data.
 */
router.post("/", async (req, res, next) => {
    try{
        const { projectIdentifier, requestTimestamp } = req.body;
        const responseData = await requestsService.processRequest(projectIdentifier, requestTimestamp);
        res.status(200).send(
            responseTemplates.success(responseData, "Request processed successfully")
        )
    }catch(err){
        next(err);
    }
});


module.exports = router;