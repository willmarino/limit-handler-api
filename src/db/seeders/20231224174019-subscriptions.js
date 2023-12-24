'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("subscriptions", [
            {
                id: 1,
                subscription_tier_id: 1,
                organization_id: 1,
                is_active: 0
            },
            {
                id: 2,
                subscription_tier_id: 2,
                organization_id: 1,
                is_active: 1
            }
        ])
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("subscriptions");
    }
};
