const { Op } = require("sequelize");
const { models } = require("../db/connection");
const SimpleErrorWrapper = require("../util/error_wrapper");
const cryptoHelpers = require("../helpers/crypto");


/**
 * @description Get all of a user's projects
 */
const getProjects = async (req) => {
    const userId = req.session.user.userId;
    const user = await models.Users.findOne({ where: { id: userId } });

    const memberships = await models.Memberships.findAll({
        where: { userId }
    });

    const organizations = await models.Organizations.findAll({
        where: { id: { [Op.in]: memberships.map((m) => m.organizationId) } }
    });

    const projects = await models.Projects.findAll({
        where: { organizationId: { [Op.in]: organizations.map((o) => o.id) } }
    })

    return { user, projects };
}


/**
 * @description Get all of a user's projects
 */
const searchProjects = async (req) => {
    const userId = req.session.user.userId;
    const user = await models.Users.findOne({ where: { id: userId } });
    
    const searchTerm = req.body.searchTerm;

    const memberships = await models.Memberships.findAll({
        where: { userId }
    });
    const organizations = await models.Organizations.findAll({
        where: { id: { [Op.in]: memberships.map((m) => m.organizationId) } }
    });

    const projects = await models.Projects.findAll({
        where: {
            organizationId: { [Op.in]: organizations.map((o) => o.id) }
        },
        include: {
            model: models.Organizations,
            as: "organization"
        }
    });

    // Actually use search term here
    const filteredProjects = (searchTerm)
        ?   projects.filter((p) => (
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.organization.name.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        : projects;

    return { user, projects: filteredProjects };
}


/**
 * @description Get most recently created project info
 * TODO long term find a better way to select orgs/projects which are heavily used by that user or other users. Need to develop requtil lib before this can happen
 */
const getRecent = async (req) => {
    const userId = req.session.user.userId;
    
    const user = await models.Users.findOne({
        where: { id: userId },
        include: [
            { model: models.Memberships, as: "memberships" }
        ]
    });

    const orgs = await models.Organizations.findAll({
        where: {
            id: {
                [Op.in]: user.memberships.map((m) => m.organizationId)
            }
        },
        order: [ ["createdAt", "ASC"] ],
        include: [ { model: models.Projects, as: "projects" } ]
    });
    const org = orgs[0];

    const project = await models.Projects.findOne({
        where: {
            id: {
                [Op.in]: orgs[0].projects.map((p) => p.id)
            }
        },
        order: [ ["createdAt", "DESC"] ],
    });

    return { user, org, project };
}


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
    getProjects,
    searchProjects,
    getRecent,
    create
}