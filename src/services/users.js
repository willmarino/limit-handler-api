const { Op } = require("sequelize");
const { models } = require("../db/connection");

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
        include: {
            model: models.Memberships,
            as: "memberships",
            where: { userId: { [Op.ne]: id } },
            include: [
                { model: models.UserRoles, as: "userRole" },
                { model: models.Users, as: "user" }
            ]   
        }
    });

    // Compile results from the two queries into an intuitive JSON
    const userInfo = {
        user: {
            userName: userWithMemberships.userName,
            createdAt: userWithMemberships.createdAt
        },
        organizations: organizationsAndTeammates.map((org) => {
            return {
                name: org.name,
                members: org.memberships.map((m) => {
                    return {
                        userName: m.user.userName,
                        userRole: m.userRole.role
                    }
                })
            }
        }),
    };

    return userInfo;
}

module.exports = {
    getUser
};