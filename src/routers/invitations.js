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


/**
 * @description When a user accepts an invitation via clicking a link in an email,
 * they will get sent to this route with some clarifying information in the request query.
 * Verify that the acceptance of the invitation is valid,
 * give the user a message indicating their success while rerouting them to /users/show.
 */
router.post("/accept", async (req, res, next) => {
    try{
        const r = await invitationsService.acceptInvitation(req);
        const { success, message } = r;
        
        const template = pug.compileFile("src/views/invitations/accept.pug");
        const markup = template({ success, message });

        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
})



module.exports = router;