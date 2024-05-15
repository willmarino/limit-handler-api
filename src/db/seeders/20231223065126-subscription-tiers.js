'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("subscription_tiers", [
            { id: 1, name: "Basic", cost: 0, user_limit_count: 2, call_limit: 100000, readable_call_limit: "One Hundred Thousand" },
            { id: 2, name: "Advanced", cost: 10, user_limit_count: 5, call_limit: 1000000, readable_call_limit: "One Million" },
            { id: 3, name: "Premium", cost: 25, user_limit_count: 10, call_limit: 10000000, readable_call_limit: "Ten Million" },
        ]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("subscription_tiers");
    }
};
