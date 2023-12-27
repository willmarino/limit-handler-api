const bcrypt = require("bcrypt");


/**
 * @description Helper func for hashing passwords.
 * Super simple, but just easier to use the same func for testing/actual functionality
 * if it is abstracted into a helpers file.
 * Returns a hashed password.
 * @param passwordInput - String entered by user representing their desired password
 */
const createPasswordHash = async (passwordInput) => {
    const hashedPassword = await bcrypt.hash(passwordInput, 10);
    return hashedPassword;
};

/**
 * @description Wrapper func for bcrypt compare
 */
const compare = async (passwordInput, hashedPassword) => {
    const passwordMatches = await bcrypt.compare(passwordInput, hashedPassword);
    return passwordMatches;
}



module.exports = {
    createPasswordHash,
    compare
}