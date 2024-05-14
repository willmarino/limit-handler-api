'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "memberships",
            [
                { id: 1, organization_id: 1, user_id: 5, user_role_id: 1, primary: true },
                { id: 2, organization_id: 1, user_id: 4, user_role_id: 3, primary: true  },
                { id: 3, organization_id: 1, user_id: 3, user_role_id: 3, primary: true },
                { id: 4, organization_id: 2, user_id: 2, user_role_id: 1, primary: true },
                { id: 5, organization_id: 2, user_id: 1, user_role_id: 2, primary: true },
                { id: 6, organization_id: 3, user_id: 3, user_role_id: 1, primary: false }
            ]
        );
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("memberships");
    }
};
