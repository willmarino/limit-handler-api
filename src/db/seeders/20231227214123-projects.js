'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "projects",
            [
                { id: 1, organization_id: 1, creator_id: 5, time_frame_id: 2, name: "org 1 5 per min", call_limit: 5 },
                { id: 2, organization_id: 2, creator_id: 1, time_frame_id: 1, name: "org 2 10 per second", call_limit: 10 },
                { id: 3, organization_id: 2, creator_id: 1, time_frame_id: 1, name: "org 1 3 per second", call_limit: 4 }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("projects");
    }
};
