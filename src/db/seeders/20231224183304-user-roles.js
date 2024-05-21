'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "user_roles",
            [
                { id: 1, role: "Owner" },
                { id: 2, role: "Admin" },
                { id: 3, role: "Member" }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("user_roles");
    }
};