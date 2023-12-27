'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "user_roles",
            [
                { id: 1, role: "owner" },
                { id: 2, role: "admin" },
                { id: 3, role: "member" }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("user_roles");
    }
};