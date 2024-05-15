const { models } = require("../db/connection");
const cryptoHelpers = require("../helpers/crypto");
const bcrypyHelpers = require("../helpers/bcrypt");
const SimpleErrorWrapper = require("../util/error_wrapper");

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
 * @description - Create a new organization given a name and generate a refresh token.
 * @param name - Name of the new organization
 */
const createOrganization = async () => {
    const { name, selectedSubTier } = req.body;

    // validate name input
    
    
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

};





module.exports = {
    getOrganization,
    createOrganization
}