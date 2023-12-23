'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("subscription_tiers", [
            { name: "Basic", cost: 0, user_limit_count: 2, call_limit: 100000 },
            { name: "Advanced", cost: 10, user_limit_count: 5, call_limit: 1000000 },
            { name: "Premium", cost: 0, user_limit_count: 10, call_limit: 10000000 },
        ]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("subscription_tiers");
    }
};
