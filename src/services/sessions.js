const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { models } = require("../db/connection");
const ErrorWrapper = require("../util/error_wrapper");


/**
 * @description Log user in if email and password are a valid combo.
 * Same error message for invalid email and incorrect password as protection against brute force attacks.
 * @param email - User's email
 * @param passwordInput - User's password
 */
const login = async (email, passwordInput) => {
    const user = await models.Users.findOne({ where: { email } });
    if(!user)
        throw new ErrorWrapper("Unable to validate credentials", 400);

    const passwordMatches = await bcrypt.compare(passwordInput, user.password);
    if(!passwordMatches)
        throw new ErrorWrapper("Unable to validate credentials", 400);

    const token = jwt.sign(
        { sub: user.email },
        process.env.JWT_SECRET,
        {
            expiresIn: "6h"
        }
    );

    return { token };
};


module.exports = {
    login
}