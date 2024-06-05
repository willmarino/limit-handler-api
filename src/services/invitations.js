const { Op } = require("sequelize");
const { models } = require("../db/connection");
const emailService = require("./emails");


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
            userRoleId: userRole.id
        }
    })

    if(matchingInvitation){
        throw new Error("You have already invited this user");
    }

    const invitation = await models.Invitations.create({
        senderId,
        organizationId: org.id,
        receiverId: receiver.id,
        userRoleId: userRole.id
    });

    await emailService.sendOrgInvitationEmail(
        req.session.user.userName,
        receiver.userName,
        orgName,
        userRoleName
    );

    return { invitation, receiverInfo };
}


module.exports = {
    createInvitation
}