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
            include: [
                { model: models.UserRoles, as: "userRole" },
                { model: models.Users, as: "user" }
            ]   
        }
    });

    // console.log(JSON.stringify(organizationsAndTeammates, null, 4));

    // Compile results from the two queries into an intuitive JSON
    const userInfo = {
        user: {
            name: userWithMemberships.userName,
            createdAt: userWithMemberships.createdAt
        },
        organizations: organizationsAndTeammates.map((org) => {
            return {
                name: org.name,
                createdAt: org.createdAt,
                members: org.memberships
                    .sort((a, b) => a.id - b.id)
                    .map((m) => {
                        return {
                            name: m.user.userName,
                            role: m.userRole.role
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