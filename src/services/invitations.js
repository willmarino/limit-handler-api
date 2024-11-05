const { Op } = require("sequelize");
const { models } = require("../db/connection");
const emailService = require("./emails");
const formHelpers = require("../helpers/forms");
const pagination = require("../config/pagination");
const flash = require("../helpers/flash");


/**
 * @description Get received invitations
 */
const getSentInvitations = async (req) => {
    const userId = req.session.user.userId;
    const { curPage, searchTerm } = formHelpers.getParamsFromQuery(req, { curPage: 1 });

    const userWhereStatement = {};
    if(searchTerm) userWhereStatement.userName = searchTerm; 

    const invitationsResponse = await models.Invitations.findAndCountAll(
        {
            where: { senderId: userId, accepted: false, unsent: false },
            limit: pagination.itemsPerPage,
            offset: (curPage - 1) * pagination.itemsPerPage,
            include: [
                {
                    model: models.Users,
                    as: "receiver",
                    where: userWhereStatement
                },
                { model: models.UserRoles, as: "userRole" },
                { model: models.Organizations, as: "organization" }
            ]
        }
    );

    const { count, rows: invitations } = invitationsResponse;

    pagination.setPaginationData(req, curPage, count);
    return { count, invitations };
}


/**
 * @description Get all received and unanswered invitations
 */
const getReceivedInvitations = async (req) => {
    const userId = req.session.user.userId;
    const { curPage, searchTerm } = formHelpers.getParamsFromQuery(req, { curPage: 1 });

    const userWhereStatement = {};
    // if(searchTerm) userWhereStatement.userName = searchTerm; 
    if(searchTerm) userWhereStatement.userName = {
        [Op.like]: `%${searchTerm}%`
    }; 

    const invitationsResponse = await models.Invitations.findAndCountAll(
        {
            where: { receiverId: userId, accepted: false, unsent: false },
            limit: pagination.itemsPerPage,
            offset: (curPage - 1) * pagination.itemsPerPage,
            include: [
                {
                    model: models.Users,
                    as: "sender",
                    where: userWhereStatement
                },
                { model: models.UserRoles, as: "userRole" },
                { model: models.Organizations, as: "organization" }
            ]
        }
    );

    const { count, rows: invitations } = invitationsResponse;

    pagination.setPaginationData(req, curPage, count);
    return { count, invitations };
}



/**
 * @description Create an invitation record, and send an email
 */
const createInvitation = async (req) => {
    const senderId = req.session.user.userId;

    // const { receiverInfo, userRoleName, orgName } = req.body;
    const { receiverEmail, organizationName, userRoleName } = req.body;

    const receiver = await models.Users.findOne({
        where: {
            [Op.or]: [
                { email: receiverEmail },
                // { userName: receiverInfo }
            ]
        }
    });

    if(!receiver){
        // throw new Error("Unable to find user by email or username");
        throw new Error("Unable to find user by email");
    }

    const org = await models.Organizations.findOne({
        where: { name: organizationName }
    })

    if(!org){
        throw new Error("Oops! Please reach out to limithandler@gmail.com");
    }

    const userRole = await models.UserRoles.findOne({
        where: { role: userRoleName }
    });

    if(!userRole){
        throw new Error("Invalid user role selection");
    }

    const matchingInvitation = await models.Invitations.findOne({
        where: {
            senderId,
            organizationId: org.id,
            receiverId: receiver.id,
            userRoleId: userRole.id,
            unsent: false,
            expirationDate: {
                [Op.gt]: new Date()
            }
        }
    })

    if(matchingInvitation){
        throw new Error("You have already invited this user");
    }

    const invitation = await models.Invitations.create({
        senderId,
        organizationId: org.id,
        receiverId: receiver.id,
        userRoleId: userRole.id,
        accepted: false,
        expirationDate: new Date().getTime() + (1000 * 60 * 60 * 24)
    });

    // await emailService.sendOrgInvitationEmail(
    //     invitation.id,
    //     req.session.user.userName,
    //     receiver.userName,
    //     orgName,
    //     userRoleName
    // );

    // return { invitation, receiverInfo };
    return 1;
}


/**
 * @description Validate invitation and acceptance info, mark invitation as accepted.
 */
const acceptInvitation = async (req) => {

    const userId = req.session.user.userId;
    const { id: invitationId } = req.params;

    const invitation = await models.Invitations.findOne({
        where: { id: invitationId, receiverId: userId }
    });


    if(!invitation){
        flash.addMessage(req, "error", "Invitation not found");
        return;
    }

    if(invitation.expirationDate < new Date()){
        flash.addMessage(req, "error", "Invitation has expired");
        return;
    }
    
    await invitation.update({ accepted: true });

    await models.Memberships.create({
        organizationId: invitation.organizationId,
        userId: invitation.receiverId,
        userRoleId: invitation.userRoleId
    });
    
    flash.addMessage(req, "success", "Invitation accepted successfully");
}


/**
 * @description Rescind or "unsend" an invitation.
 */
const unsend = async (req) => {
    const { id: invitationId } = req.params;

    const invitation = await models.Invitations.findOne({ where: { id: invitationId } });
    await invitation.update({ unsent: true });

}






module.exports = {
    getSentInvitations,
    getReceivedInvitations,
    createInvitation,
    acceptInvitation,
    unsend
}