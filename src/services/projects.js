const { Op } = require("sequelize");
const { models } = require("../db/connection");
const RED = require("../util/redis_connection_wrapper");
const SimpleErrorWrapper = require("../util/error_wrapper");
const cryptoHelpers = require("../helpers/crypto");
const pConf = require("../config/pagination");



/**
 * @description Get a single project
 */
const getProject = async (req) => {
    const project = await models.Projects.findOne({ where: { id: req.params.id } });
    const organization = await models.Organizations.findOne({ where: { id: project.organizationId } });
    const projectTimeFrame = await models.TimeFrames.findOne({ where: { id: project.timeFrameId } })

    const datasets = [
        {
            label: "www.abcdef.com",
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0, 0, 255, 1.0)",
            borderColor: "rgba(0, 0, 255, 0.3)",
            data: []
        },
        {
            label: "www.ghijk.com",
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(252, 3, 3, 1.0)",
            borderColor: "rgba(252, 3, 3, 0.3)",
            data: []
        },
        {
            label: "www.lmnopqrstuv.com",
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(25, 94, 0, 1.0)",
            borderColor: "rgba(25, 94, 0, 0.3)",
            data: []
        }
    ];

    for(const dataset of datasets){
        for(let i = 0; i < 7; i++){
            dataset.data.push(Math.round(Math.random() * 10));
        }
    }

    return {
        project,
        organization,
        projectTimeFrame,
        // allTimeFrames,
        userSelectedTimeFrame: req.query.userSelectedTimeFrame,
        user: { userName: req.session.user.userName },
        datasets,

    };
}


/**
 * @description New getProjects func which can be run by index and search router functions
 */
const getProjects = async (req) => {
    const curPage = (req.query.curPage) ? parseInt(req.query.curPage) : 1;
    const searchTerm = req.query.searchTerm;

    const userId = req.session.user.userId;
    const user = await models.Users.findOne({ where: { id: userId } });
    

    const memberships = await models.Memberships.findAll({
        where: { userId }
    });
    const organizations = await models.Organizations.findAll({
        where: { id: { [Op.in]: memberships.map((m) => m.organizationId) } }
    });

    const projectsWhereClause = {
        organizationId: { [Op.in]: organizations.map((o) => o.id) }
    }
    if(searchTerm){ projectsWhereClause.name = { [Op.like]: `%${searchTerm}%` } }

    const projectsCount = await models.Projects.count({ where: projectsWhereClause });
    const numPages = Math.ceil(projectsCount / pConf.itemsPerPage);

    const projects = await models.Projects.findAll({
        where: projectsWhereClause,
        include: [
            { model: models.Organizations, as: "organization" },
            { model: models.TimeFrames, as: "timeFrame" }
        ],
        order: [ ["name", "ASC"] ],
        limit: pConf.itemsPerPage,
        offset: (curPage > 1) ? (curPage - 1) * pConf.itemsPerPage : 0
    });

    return { user, projects, searchTerm, curPage, numPages };
}



/**
 * @description Get most recently created project info
 * TODO long term find a better way to select orgs/projects which are heavily used by that user or other users. Need to develop requtil lib before this can happen
 */
// const getRecent = async (req) => {
//     const userId = req.session.user.userId;
    
//     const user = await models.Users.findOne({
//         where: { id: userId },
//         include: [
//             { model: models.Memberships, as: "memberships" }
//         ]
//     });

//     const orgs = await models.Organizations.findAll({
//         where: {
//             id: {
//                 [Op.in]: user.memberships.map((m) => m.organizationId)
//             }
//         },
//         order: [ ["createdAt", "ASC"] ],
//         include: [ { model: models.Projects, as: "projects" } ]
//     });
//     const org = orgs[0];

//     const project = await models.Projects.findOne({
//         where: {
//             id: {
//                 [Op.in]: orgs[0].projects.map((p) => p.id)
//             }
//         },
//         order: [ ["createdAt", "DESC"] ],
//     });

//     return { user, org, project };
// }


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

    project.timeFrame = timeFrame; // this is awkward, storeProject needs the project obj to have timeFrame attached
    await RED.storeProject(project);

    return project;
};


module.exports = {
    getProjects,
    // searchProjects,
    // getRecent,
    create,
    getProject
}