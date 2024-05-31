const { models } = require("../db/connection");
const emailService = require("./emails");


/**
 * @description Create an invitation record, and send an email
 */
const createInvitation = async (req) => {
    const senderId = req.session.user.userId;

    console.log({ ...req.body, senderId });
    
    const { receiverEmail, userRoleName, orgName } = req.body;

    const receiver = await models.Users.findOne({
        where: { email: receiverEmail }
    });

    if(!receiver){
        throw new Error("a");
    }

    const org = await models.Organizations.findOne({
        where: { name: orgName }
    })

    if(!org){
        throw new Error("b");
    }

    const userRole = await models.UserRoles.findOne({
        where: { role: userRoleName }
    });

    if(!userRole){
        throw new Error("c");
    }

    const invitation = await models.Invitations.create({
        senderId,
        receiverId: receiver.id,
        userRoleId: userRole.id
    });

    await sendOrgInvitationEmail(
        req.session.user.userName,
        receiver.name,
        orgName,
        userRoleName
    );

    return invitation;
}


module.exports = {
    createInvitation
}