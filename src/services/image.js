const AWS = require("aws-sdk");
const S3 = new AWS.S3();

/**
 * @description Given image data in req.body, use aws sdk to save the file to lh-staging-profile-photos bucket
 */
const uploadProfilePicture = async (req) => {
    let imageData;

    const resp = await new Promise((resolve, reject) => {
        try{
            S3.putObject(imageData, (err, data) => {
                if(err) reject(err);
                resolve(data);
            })
        }catch(err){
            reject(err);
        }
    });

    console.log(resp);
}


module.exports = {
    uploadProfilePicture
}