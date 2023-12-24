'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "memberships",
            [
                { id: 1, organization_id: 1, user_id: 5 },
                { id: 2, organization_id: 1, user_id: 4 },
                { id: 3, organization_id: 1, user_id: 3 },
                { id: 4, organization_id: 2, user_id: 2 },
                { id: 5, organization_id: 2, user_id: 1 }
            ]
        );
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("memberships");
    }
};
