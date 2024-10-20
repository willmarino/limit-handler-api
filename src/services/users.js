const { Op } = require("sequelize");
const { models } = require("../db/connection");
const RED = require("../util/redis_connection_wrapper");
const { createHash } = require("../helpers/bcrypt");
const formValidators = require("../helpers/form_validation");
const dateHelpers = require("../helpers/dates")

const SimpleErrorWrapper = require("../util/error_wrapper");

/**
 * @description Fetch a user, along with their memberships, organizations, and teammates.
 * @param id - A user id from request parameters
 */
const getUser = async (userId) => {

    // Fetch user, memberships, and user roles within those memberships
    const userWithMemberships = await models.Users.findOne({
        where: { id: userId },
        include: {
            model: models.Memberships,
            as: "memberships",
            where: { userId },
            order: [[ "primary", "DESC" ]],
            required: false,
            include: {
                model: models.UserRoles,
                as: "userRole",
                required: false,
            }
        }
    });

    if(!userWithMemberships){
        throw new SimpleErrorWrapper("Unable to locate user", 400);
    }

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
                    { // TODO add user roles here, I want to display teammates and their permissions level, like on github
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

    const userRoles = await models.UserRoles.findAll(); // Needed for member invite functionality in sidebar


    // Compile results from the two queries into an intuitive JSON
    const userInfo = {
        user: {
            userName: userWithMemberships.userName, // TODO this is heinous
            name: userWithMemberships.userName,
            email: userWithMemberships.email,
            createdAt: userWithMemberships.createdAt
        },
        organizations: organizationsAndTeammates.map((org) => {
            return {
                name: org.name,
                identifier: org.identifier,
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
        userRoles: userRoles.map((ur) => ur.role)
    };

    return userInfo;
}


/**
 * @description Get a user object with no associated data, used for request context.
 */
const getUserSimple = async (id) => {
    const user = await models.Users.findOne({ where: { id } });
    
    if(!user){
        throw new SimpleErrorWrapper("Unable to locate user")
    }else{
        return user;
    }
}


/**
 * @description Get managerial data for a user - thinking profile photo editing, orgs, invitations, maybe keys
 */
const getProfile = async (req) => {
    const userId = req.session.user.userId;
    const user = await models.Users.findOne({ where: { id: userId } });

    const organizations = await models.Organizations.findAll({
        include: {
            model: models.Memberships,
            as: "memberships",
            where: { userId }
        }
    });
    organizations.sort((a, b) => a.membership.userRoleId - b.membership.userRoleId);

    const openInvitations = await models.Invitations.findAll({
        where: {
            receiverId: userId,
        },
        include: [
            { model: models.Users, as: "sender" },
            { model: models.UserRoles, as: "userRole" },
            { model: models.Organizations, as: "organization" }
        ]
    })

    const resultObj = {
        user: {
            name: user.userName,
            email: user.email,
            createdAt: dateHelpers.simpleDateString(user.createdAt)
        },
        organizations: organizations.map((org) => {
            return {
                name: org.name
            }
        }),
        invitations: openInvitations.map((inv) => {
            return {
                id: inv.id,
                expirationDate: dateHelpers.simpleDateString(inv.expirationDate),
                expired: inv.expirationDate < new Date(),
                accepted: inv.accepted,
                sender: inv.sender.userName,
                org: inv.organization.name,
                role: inv.userRole.role,
            }
        })
    }

    return resultObj;
}



/**
 * @description Take in registration input and create a new user if info is valid.
 * @param userName - UserName of new user
 * @param email - Email of new user
 * @param passwordInput - Unhashed password selected by user
 */
const registerUser = async (req) => {
    const { userName, email, passwordInput } = req.body;

    // Input validations
    if(!userName || !email || !passwordInput)
        throw new SimpleErrorWrapper("Unable to process request", 400);

    formValidators.validateLength(userName, 6, 24, "Username must be between 6 and 24 characters");
    formValidators.validateProfanity(userName, "Username cannot include profanity");
    formValidators.validateNoSymbols(userName, "Username cannot include special characters")

    formValidators.validateEmail(email, "Invalid email address");

    formValidators.validateLength(passwordInput, 8, 24, "Password must be between 8 and 24 characters");
    formValidators.validateHasNumbers(passwordInput, "Password must include at least one number");
    formValidators.validateHasSymbols(passwordInput, "Password must include at least one special character");
    formValidators.validateProfanity(passwordInput, "Password cannot include profanity");

    // Data validations
    const emailInUse = await models.Users.findOne({ where: { email } });
    if(emailInUse){
        throw new SimpleErrorWrapper("Email already in use", 400);
    }

    const userNameTaken = await models.Users.findOne({ where: { userName } });
    if(userNameTaken){
        throw new SimpleErrorWrapper("Username is not available", 400);
    }
    
    // All validations have passed, created new user
    const hashedPassword = await createHash(passwordInput);

    const user = await models.Users.create({
        userName,
        email,
        password: hashedPassword
    });

    await user.reload();

    req.session.user = {
        userId: user.id,
        email: user.email,
        password: user.password
    }

    return user;
};


module.exports = {
    getUser,
    getUserSimple,
    getProfile,
    registerUser
};