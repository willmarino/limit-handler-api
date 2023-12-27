const jwt = require("jsonwebtoken");

/**
 * @description Create a new JWT, return it
 * @param userEmail - A user's email
 */
const createNewJWT = (userEmail) => {
    const token = jwt.sign(
        { sub: userEmail },
        process.env.JWT_SECRET,
        {
            expiresIn: "6h"
        }
    );

    return token;
};


module.exports = {
    createNewJWT
};