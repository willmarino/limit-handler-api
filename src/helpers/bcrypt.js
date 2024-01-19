const bcrypt = require("bcrypt");


/**
 * @description Helper func for hashing any string.
 * @param input - String entered by user representing their desired password
 */
const createHash = async (input) => {
    const hash = await bcrypt.hash(input, 10);
    return hash;
};

/**
 * @description Wrapper func for bcrypt compare.
 * Used for user passwords, api keys
 */
const compare = async (input, storedHash) => {
    const match = await bcrypt.compare(input, storedHash);
    return match;
}



module.exports = {
    createHash,
    compare
}