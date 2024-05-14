const jwt = require("jsonwebtoken");

/**
 * @description Create a new JWT, return it.
 * @param email - A user's email
 */
const create = (email, passwordHash) => {
    const token = jwt.sign(
        {
            sub: email,
            pw: passwordHash
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "6h"
        }
    );

    return token;
};


/**
 * @description Verify a JWT, return boolean.
 * @param token - A user's JWT
 */
const verify = (token) => {
    const verifiedTokenData = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    return verifiedTokenData;
}


module.exports = {
    create,
    verify
};