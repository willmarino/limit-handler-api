const { models } = require("../db/connection");
const SimpleErrorWrapper = require("../util/error_wrapper");
const cryptoHelpers = require("../helpers/crypto");


/**
 * @description Create a project, return it.
 * Make sure creating user is an admin or owner, not just a random member.
 */
const create = async (creator, projectConfig) => {
    const {
        organizationId,
        name,
        callLimit,
        timeFrameId
    } = projectConfig;

    const membership = await models.Memberships.findOne({
        where: { userId: creator.id, organizationId },
        include: { model: models.UserRoles, as: "userRole" }
    });

    if(!membership)
        throw new SimpleErrorWrapper("Cannot create project, you are not a member of that organization", 400);

    if(!["owner", "admin"].includes(membership.userRole.role))
        throw new SimpleErrorWrapper("Insufficiet permissions, you need to be an owner or admin to create projects", 400);

    const identifier = await cryptoHelpers.generateRandomString(8);
    const project = await models.Projects.create({
        creatorId: creator.id,
        organizationId,
        name,
        identifier,
        callLimit,
        timeFrameId
    });

    await project.reload();

    return project;
};


module.exports = {
    create,
}