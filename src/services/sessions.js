const { models } = require("../db/connection");
const bcryptHelpers = require("../helpers/bcrypt");
const SimpleErrorWrapper = require("../util/error_wrapper");


/**
 * @description Log user in if email and password are a valid combo.
 * Same error message for invalid email and incorrect password as protection against brute force attacks.
 */
const login = async (req) => {
    const { email, passwordInput } = req.body;

    const user = await models.Users.findOne({ where: { email } });
    if(!user)
        throw new SimpleErrorWrapper("Unable to validate credentials", 400);

    const passwordMatches = await bcryptHelpers.compare(passwordInput, user.password);
    if(!passwordMatches)
        throw new SimpleErrorWrapper("Unable to validate credentials", 400);

    await models.Sessions.create({
        userId: user.id
    });

    // TODO I should encrypt this information, decrypt it during request validation (sessionCookieValidation middleware), and cache the successful decryption
    req.session.user = {
        userId: user.id,
        email: user.email,
        password: user.password
    }

};


module.exports = {
    login
}