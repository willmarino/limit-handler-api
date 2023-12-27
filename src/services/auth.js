const bcrypt = require("bcrypt");
const BadWordsFilter = require("bad-words");
const badWordsFilter = new BadWordsFilter();
const emailValidator = require("email-validator");
const { models } = require("../db/connection");
const ErrorWrapper = require("../util/error_wrapper");

/**
 * @description Take in registration input and create a new user if info is valid.
 * @param userName - UserName of new user
 * @param email - Email of new user
 * @param passwordInput - Unhashed password selected by user
 */
const registerUser = async (userName, email, passwordInput) => {

    const specialChars = [
        '!', '@', '#', '$',
        '%', '^', '&', '*',
        '(', ')', '_', '-',
        '+', '='
    ];
    
    const numbers = [
        '1', '2', '3', '4',
        '5', '6', '7', '8',
        '9', '0'
    ];

    if(!userName || !email || !passwordInput)
        throw new ErrorWrapper("Unable to process request", 400);

    const userNameValid = Boolean(
        userName.length >= 6 &&
        userName.length <= 24 &&
        !badWordsFilter.isProfane(userName) &&
        !specialChars.some((c) => userName.includes(c))
    );
    if(!userNameValid)
        throw new ErrorWrapper("Username must be between 6 and 24 characters, and cannot include profanity", 400);

    const emailValid = Boolean(
        emailValidator.validate(email) &&
        !badWordsFilter.isProfane(email)
    );
    if(!emailValid)
        throw new ErrorWrapper("Invalid email address", 400);

    const passwordInputValid = Boolean(
        passwordInput.length >= 8 &&
        passwordInput.length <= 32 &&
        specialChars.some((c) => passwordInput.includes(c)) && 
        numbers.some((c) => passwordInput.includes(c)) &&
        !badWordsFilter.isProfane(passwordInput)
    );
    if(!passwordInputValid)
        throw new ErrorWrapper("Password must be between 8 and 32 characters, must contain a special character and number, and cannot contain profanity", 400);

    
    // All validations have passed, created new user
    const hashedPassword = await bcrypt.hash(passwordInput, 10);

    const user = await models.Users.create({
        userName,
        email,
        password: hashedPassword
    });

    await user.reload();

    return user;
};


module.exports = {
    registerUser
}