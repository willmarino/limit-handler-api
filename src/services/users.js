const { Op } = require("sequelize");
const BadWordsFilter = require("bad-words");
const badWordsFilter = new BadWordsFilter();
const emailValidator = require("email-validator");
const { createHash } = require("../helpers/bcrypt");
const { models } = require("../db/connection");
const ErrorWrapper = require("../util/error_wrapper");
const RED = require("../util/redis_connection_wrapper");

/**
 * @description Fetch a user, along with their memberships, organizations, and teammates
 * @param id - A user id from request parameters
 */
const getUser = async (id) => {

    // Fetch user, memberships, and user roles within those memberships
    const userWithMemberships = await models.Users.findOne({
        where: { id },
        include: {
            model: models.Memberships,
            as: "memberships",
            where: { userId: id },
            include: {
                model: models.UserRoles,
                as: "userRole"
            }
        }
    });

    // Fetch organizations and other members which are teammates with the user
    const organizationsAndTeammates = await models.Organizations.findAll({
        where: {
            id: {
                [Op.in]: userWithMemberships.memberships.map((m) => m.organizationId)
            }
        },
        include: [
            {
                model: models.Memberships,
                as: "memberships",
                include: [
                    { model: models.UserRoles, as: "userRole" },
                    { model: models.Users, as: "user" }
                ]
            },
            {
                model: models.Projects,
                as: "projects",
                include: [
                    {
                        model: models.Users,
                        as: "creator"
                    },
                    {
                        model: models.TimeFrames,
                        as: "timeFrame"
                    }
                ]
            }
        ]
    });

    const projectRequestsById = {};
    for(const org of organizationsAndTeammates){
        for(const project of org.projects){
            const projectConfig = await RED.client.get(`projects:${project.identifier}`);
            projectRequestsById[project.identifier] = JSON.parse(projectConfig).requests;
        }
    }

    // Compile results from the two queries into an intuitive JSON
    const userInfo = {
        user: {
            name: userWithMemberships.userName,
            email: userWithMemberships.email,
            createdAt: userWithMemberships.createdAt
        },
        organizations: organizationsAndTeammates.map((org) => {
            return {
                name: org.name,
                createdAt: org.createdAt,
                members: org.memberships
                    .sort((a, b) => a.userRoleId - b.userRoleId)
                    .map((m) => {
                        return {
                            name: m.user.userName,
                            email: m.user.email,
                            role: m.userRole.role
                        }
                    }),
                projects: org.projects.map((p) => {
                    return {
                        name: p.name,
                        creator: p.creator.userName,
                        callLimit: p.callLimit,
                        timeFrame: p.timeFrame.name,
                        requests: projectRequestsById[p.id]
                    }
                })
            }
        }),
    };

    return userInfo;
}



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
    const hashedPassword = await createHash(passwordInput);

    const user = await models.Users.create({
        userName,
        email,
        password: hashedPassword
    });

    await user.reload();

    return user;
};


module.exports = {
    getUser,
    registerUser
};