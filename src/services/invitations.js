const { Op } = require("sequelize");
const { models } = require("../db/connection");
const emailService = require("./emails");
// const bcryptHelpers = require("../helpers/bcrypt");
const formHelpers = require("../helpers/forms");
const pConf = require("../config/pagination");


/**
 * @description Get received invitations
 */
const getReceivedInvitations = async (req) => {
    const userId = req.session.user.userId;
    const { curPage } = formHelpers.getParamsFromQuery(req, { curPage: 1 });

    const invitationsResponse = await models.Invitations.findAndCountAll(
        {
            where: { receiverId : userId },
            limit: pConf.itemsPerPage,
            offset: (curPage - 1) * pConf.itemsPerPage
        }
    );

    const { count, rows: invitations } = invitationsResponse;
    
    return { count, invitations };
}


/**
 * @description Create an invitation record, and send an email
 */
const createInvitation = async (req) => {
    const senderId = req.session.user.userId;

    const { receiverInfo, userRoleName, orgName } = req.body;

    const receiver = await models.Users.findOne({
        where: {
            [Op.or]: [
                { email: receiverInfo },
                { userName: receiverInfo }
            ]
        }
    });

    if(!receiver){
        throw new Error("Unable to find user by email or username");
    }

    const org = await models.Organizations.findOne({
        where: { name: orgName }
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

    await emailService.sendOrgInvitationEmail(
        invitation.id,
        req.session.user.userName,
        receiver.userName,
        orgName,
        userRoleName
    );

    return { invitation, receiverInfo };
}


/**
 * @description Validate invitation and acceptance info, mark invitation as accepted.
 */
const acceptInvitation = async (req) => {
    const { invitationId } = req.body;

    const invitation = await models.Invitations.findOne({
        where: { id: invitationId }
    });

    if(!invitation){
        return { success: false, message: "Invitation not found" };
    }

    if(invitation.expirationDate < new Date()){
        return { success: false, message: "Invitation has expired" };
    }
    
    await invitation.update({ accepted: true });

    await models.Memberships.create({
        organizationId: invitation.organizationId,
        userId: invitation.receiverId,
        userRoleId: invitation.userRoleId
    })
    
    return { success: true, message: "Invitation accepted" };

}








module.exports = {
    getReceivedInvitations,
    createInvitation,
    acceptInvitation
}