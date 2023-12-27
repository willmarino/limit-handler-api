const { models } = require("../db/connection");


/**
 * @description Fetch a user, along with their memberships, organizations, and teammates
 */
const getUser = async (id) => {
    
    // Fetch user, their memberships, and which organizations those memberships apply to.
    const userAndOrganizations = await models.Users.findOne({
        where: { id },
        include: [
            {
                model: models.Memberships,
                as: "memberships",
                include: [
                    {
                        model: models.Organizations,
                        as: "organization",
                        include: [
                            {
                                model: models.Memberships,
                                as: "memberships",
                                include: [
                                    {
                                        model: models.Users,
                                        as: "user"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    return userAndOrganizations;
}

module.exports = {
    getUser
};