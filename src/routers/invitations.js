const pug = require("pug");
const router = require("express").Router();
const invitationsService = require("../services/invitations");

/**
 * @description Memberships - Creation of invites - sends email to user, creates invitation.
 * Only send back a p tag with a status message!
 */
router.post("/create", async (req, res, next) => {
    try{
        const { invitation, receiverInfo } = await invitationsService.createInvitation(req);

        const template = pug.compileFile("src/views/invitations/create.pug");
        const markup = template({ message: `Sent an invitation to ${receiverInfo}` });
        res.status(200).send(markup);

    }catch(err){
        const template = pug.compileFile("src/views/invitations/create.pug");
        const markup = template({ message: err.message });
        res.status(200).send(markup);

    }
});



module.exports = router;