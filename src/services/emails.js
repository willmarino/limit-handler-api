const AWS = require("aws-sdk");
const SES = new AWS.SES();



const sendOrgInvitationEmail = async (senderName, receiverName, orgName, userRoleName) => {
    console.log({
        senderName, receiverName, orgName, userRoleName
    });
    return;
}



module.exports = {
    sendOrgInvitationEmail
}