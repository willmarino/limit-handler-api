const AWS = require("aws-sdk");
const SES = new AWS.SES({ region: "us-east-1" });



const sendOrgInvitationEmail = async (senderName, receiverName, orgName, userRoleName) => {
    console.log({
        senderName, receiverName, orgName, userRoleName
    });

    console.log(SES);

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
                        Text: {
                            Data: "hello k"
                        }
                    },
                    Subject: {
                        Data: "ABC"
                    }
                }
            }, (err, data) => {
                if(err) {
                    console.log(err);
                    reject(err)
                };
                console.log(data);
                resolve(data);
            });
        }catch(err){
            console.log(err);
            reject(err);
        }
    });

    return;
}



module.exports = {
    sendOrgInvitationEmail
}