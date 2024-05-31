const router = require("express").Router();
const invitationsService = require("../services/invitations");

/**
 * @description Memberships - Creation of invites - sends email to user, creates invitation.
 * Only send back a p tag with a status message!
 */
router.post("/invitations/create", async (req, res, next) => {
    try{
        const invitation = await invitationsService.createInvitation(req);
    }catch(err){
        next(err);
    }
});



module.exports = router;