const { models } = require("../db/connection");
const SimpleErrorWrapper = require("../util/error_wrapper");
const cryptoHelpers = require("../helpers/crypto");


/**
 * @description Create a project, return it.
 * Make sure creating user is an admin or owner, not just a random member.
 * TODO make sure you are using org identifier from req, not org id
 */
const create = async (req) => {
    const creatorId = req.session.user.userId;
    const { orgName, name, callLimit, timeFrameName } = req.body;

    const org = await models.Organizations.findOne({
        where: { name: orgName }
    });

    const timeFrame = await models.TimeFrames.findOne({
        where: { name: timeFrameName }
    });

    const membership = await models.Memberships.findOne({
        where: { userId: creatorId, organizationId: org.id },
        include: { model: models.UserRoles, as: "userRole" }
    });

    if(!membership)
        throw new SimpleErrorWrapper("Cannot create project, you are not a member of that organization", 400);

    if(!["owner", "admin"].includes(membership.userRole.role.toLowerCase()))
        throw new SimpleErrorWrapper("Insufficient permissions, you need to be an owner or admin to create projects", 400);

    const identifier = await cryptoHelpers.generateRandomString(8);
    const project = await models.Projects.create({
        creatorId: creatorId,
        organizationId: org.id,
        name,
        identifier,
        callLimit,
        timeFrameId: timeFrame.id
    });

    await project.reload();

    return project;
};


module.exports = {
    create,
}