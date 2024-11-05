const pug = require("pug");
const router = require("express").Router();
const invitationsService = require("../services/invitations");
const usersService = require("../services/users");
const userRolesService = require("../services/user_roles");
const { viewAttrs } = require("../helpers/views");


/**
 * @description Received invitations index - scoped to user
 */
router.get("/sent", async (req, res, next) => {
    try{

        const r = await invitationsService.getSentInvitations(req);

        const template = pug.compileFile("src/views/invitations/sent.pug");
        const markup = template ({ ...r, pageName: "Sent", ...viewAttrs(req) });

        res.set("HX-Push-Url", `/invitations/sent?curPage=${req.context.get("queryParams").curPage}`);
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
})

/**
 * @description Sent invitations index
 */
router.get("/received", async (req, res, next) => {
    try{
        const r = await invitationsService.getReceivedInvitations(req);

        const template = pug.compileFile("src/views/invitations/received.pug");
        const markup = template({ ...r, pageName: "Received", ...viewAttrs(req) });

        res.set("HX-Push-Url", `/invitations/received?curPage=${req.context.get("queryParams").curPage}`);
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});


/**
 * @description Get template for new invitation creation.
 */
router.get("/new", async (req, res, next) => {
    try{
        const r = await usersService.getUser(req.session.user.userId);
        const userRoles = await userRolesService.getAll();
        
        const template = pug.compileFile("src/views/invitations/new.pug");
        const markup = template({
            ...r,
            userRoles,
            pageName: "Send New Invite",
            ...viewAttrs(req)
        });

        res.set("HX-Push-Url", `/invitations/new`);
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
})


/**
 * @description Creating a new invitation new invitations.
 */
router.post("/create", async (req, res, next) => {
    try{
        const r = await invitationsService.createInvitation(req);
        res.redirect("/invitations/sent");
    }catch(err){
        res.redirect("/invitations/sent");

    }
});


/**
 * @description Accept an invitation from the received invitations menu.
 */
router.post("/accept/:id", async (req, res, next) => {
    try{
        await invitationsService.acceptInvitation(req);
        res.redirect("/invitations/received");
    }catch(err){
        res.redirect("/invitations/received");
    }
});


/**
 * @description When a user rescinds an invitation.
 */
router.post("/undo/:id", async (req, res, next) => {
    try{
        await invitationsService.unsend(req);
        res.redirect(`/invitations/sent?siteMessage=${"Success rescinding invitation"}`);
    }catch(err){
        res.redirect("/invitations/sent");
    }
})



module.exports = router;