// const usersService = require("./users");
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
// const login = async (email, passwordInput) => {
const login = async (req) => {
    const { email, passwordInput } = req.body;

    const user = await models.Users.findOne({ where: { email } });
    if(!user)
        throw new SimpleErrorWrapper("Unable to validate credentials", 400);

    const passwordMatches = await bcryptHelpers.compare(passwordInput, user.password);
    if(!passwordMatches)
        throw new SimpleErrorWrapper("Unable to validate credentials", 400);

    // TODO close any open sessions on DB, if req.session expires without the user logging out, they will have to log in again while there is an open session on DB.
    // TODO I could set up jobs to close sessions? This is a stretch goal.
    await models.Sessions.create({
        userId: user.id
    });

    // const userRelatedData = await usersService.getUser(user.id);
    
    // const token = jwtHelpers.create(user.email, user.password);
    
    // return{
        //     user: userRelatedData
    // }
    
    // req.session.userId = user.id;
    req.session.user = {
        userId: user.id,
        email: user.email,
        password: user.password
    }
};


module.exports = {
    login
}