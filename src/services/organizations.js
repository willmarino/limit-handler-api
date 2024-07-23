const { Op } = require("sequelize");
const { models } = require("../db/connection");
const formValidators = require("../helpers/form_validation");
const cryptoHelpers = require("../helpers/crypto");
const bcrypyHelpers = require("../helpers/bcrypt");
const SimpleErrorWrapper = require("../util/error_wrapper");
const pConf = require("../config/pagination");

/**
 * @description Get organization by id.
 * @param orgId - Id of organization
 * @param userId - Id of user
 */
const getOrganization = async (orgId, userId) => {

    const memberships = await models.Memberships.findAll({
        where: { userId: userId }
    });

    const orgIds = memberships.map((m) => m.organizationId);
    const requestingUserInOrg = Boolean(
        orgIds.includes(parseInt(orgId))
    );
    
    if(!requestingUserInOrg){
        throw new SimpleErrorWrapper("Not a member of this organization", 400);
    }

    const organization = await models.Organizations.findOne({
        where: { id: orgId },
        include: [
            {
                model: models.Memberships,
                as: "memberships",
                include: [
                    { model: models.Users, as: "user" },
                    { model: models.UserRoles, as: "userRole" }
                ],

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

    const orgResponse = {
        name: organization.name,
        identifier: organization.identifier,
        createdAt: organization.createdAt,
        members: organization.memberships
            .sort((a, b) => a.userRoleId - b.userRoleId)
            .map((m) => {
                return {
                    name: m.user.userName,
                    email: m.user.email,
                    role: m.userRole.role
                }
            }),
        projects: organization.projects.map((p) => {
            return {
                name: p.name,
                creator: p.creator.userName,
                callLimit: p.callLimit,
                timeFrame: p.timeFrame.name
            }
        })
    };

    return orgResponse;
}

/**
 * @description - Condensed version of getOrg, just get info needed to display basic org attributes.
 */
const getOrgSimple = async (orgId) => {
    const org = await models.Organizations.findOne({ where: { identifier: orgId } });
    return org;
}


/**
 * @description Get all organizations which requesting user is a part of.
 */
const getUserOrganizations = async (req) => {
    const userId = req.session.user.userId;
    const searchTerm = req.query.searchTerm;

    const memberships = await models.Memberships.findAll({ where: { userId: userId } });

    const orgsWhereClause = { id: { [Op.in]: memberships.map((m) => m.organizationId) } };
    if(searchTerm){
        orgsWhereClause.name = { [Op.like]: `%${searchTerm}%` };
    }

    const organizations = await models.Organizations.findAll({
        where: orgsWhereClause
    });

    return { organizations };
}


/**
 * @description - Create a new organization given a name and generate a refresh token.
 * @param name - Name of the new organization
 */
const createOrganization = async (req) => {
    const { name, selectedSubTier } = req.body;

    if(!name) throw new SimpleErrorWrapper("Please enter an organization name");
    if(!selectedSubTier) throw new SimpleErrorWrapper("Please select a subscription tier");

    // Input validation
    formValidators.validateProfanity(name, "Org name cannot include profanity");
    formValidators.validateLength(name, 6, 24, "Org name must be in between 6 and 24 characters");
    formValidators.validateNoSymbols(name, "Org name cannot contain special characters");

    const orgWithSameName = await models.Organizations.findOne({ where: { name } });
    if(orgWithSameName){
        throw new SimpleErrorWrapper("That name is already taken");
    }
    
    // Generate new api key
    const identifier = await cryptoHelpers.generateRandomString(8);
    const refreshToken = await cryptoHelpers.generateRandomString(18);
    const hashedRefreshToken = await bcrypyHelpers.createHash(refreshToken);

    // Create organization db record
    const organization = await models.Organizations.create({
        refreshToken: hashedRefreshToken,
        name,
        identifier
    });

    await organization.reload();

    // Make new subscription for organization
    const subscriptionTier = await models.SubscriptionTiers.findOne({ where: { name: selectedSubTier } });
    if(!subscriptionTier) throw new SimpleErrorWrapper("Invalid subscription tier");

    const subscription = await models.Subscriptions.create({
        subscriptionTierId: subscriptionTier.id,
        organizationId: organization.id,
        isActive: true
    });

    await subscription.reload();

    const otherMemberships = await models.Memberships.findAll({ where: { userId: req.session.user.userId } });
    const isNewMembershipPrimary = otherMemberships.length > 0;

    const userRole = await models.UserRoles.findOne({ where: { role: "owner" } });
    const membership = await models.Memberships.create({
        organizationId: organization.id,
        userId: req.session.user.userId,
        userRoleId: userRole.id,
        primary: isNewMembershipPrimary
    });

};



module.exports = {
    getOrganization,
    getOrgSimple,
    getUserOrganizations,
    createOrganization
}