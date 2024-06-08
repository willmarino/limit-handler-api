const fs = require("fs");
const AWS = require("aws-sdk");
const SES = new AWS.SES({ region: "us-east-1" });
const bcryptHelpers = require("../helpers/bcrypt");
const { logger } = require("../util/logger");



const sendOrgInvitationEmail = async (invitationId, senderName, receiverName, orgName, userRoleName) => {

    const acceptURL = `${process.env.SERVER_URL}/users/profile/invitations`;
    const logoURL = `${process.env.SERVER_URL}/img/logo/clock_64.png`;

    await new Promise((resolve, reject) => {
        try{
            SES.sendEmail({
                Source: "limithandler@gmail.com",
                Destination: {
                    ToAddresses: [
                        "w.marino997@gmail.com"
                    ]
                },
                Message: {
                    Body: {
                        Html: {
                            Data:
                                `
                                <p> Hello ${receiverName}, </p>
                                <br>
                                <a href=${acceptURL}> ${senderName} has invited you to join the organization ${orgName}, please follow this link to accept the invitation </a>

                                <p> Please feel free to contact limithandler@gmail.com with any questions. </p>
                                
                                <br>
                                <img src=${logoURL}></img>
                                <p> Limit Handler Team :) </p>

                                `
                        }
                    },
                    Subject: {
                        Data: "ABC"
                    }
                }
            }, (err, data) => {
                if(err) {
                    logger.error("Org invitation email failed", { senderName, receiverName, orgName, userRoleName });
                    reject(err)
                };
                logger.info("Org invitation email succeeded", { senderName, receiverName, orgName, userRoleName });
                resolve(data);
            });
        }catch(err){
            logger.error("Org invitation email failed", { senderName, receiverName, orgName, userRoleName });
            reject(err);
        }
    });

    return;
}



module.exports = {
    sendOrgInvitationEmail
}