const bcryptHelpers = require("../helpers/bcrypt");
const jwtHelpers = require("../helpers/jwt");
const { models } = require("../db/connection");
const SimpleErrorWrapper = require("../util/error_wrapper");


/**
 * @description Log user in if email and password are a valid combo.
 * Same error message for invalid email and incorrect password as protection against brute force attacks.
 * @param email - User's email
 * @param passwordInput - User's password
 */
const login = async (email, passwordInput) => {
    const user = await models.Users.findOne({ where: { email } });
    if(!user)
        throw new SimpleErrorWrapper("Unable to validate credentials", 400);

    const passwordMatches = await bcryptHelpers.compare(passwordInput, user.password);
    if(!passwordMatches)
        throw new SimpleErrorWrapper("Unable to validate credentials", 400);

    await models.Sessions.create({
        userId: user.id
    });

    const token = jwtHelpers.create(user.email, user.password);

    return { token };
};


module.exports = {
    login
}