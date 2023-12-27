'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "time_frames",
            [
                { id: 1, name: "second", ms: 1000 },
                { id: 2, name: "minute", ms: (1000 * 60) },
                { id: 3, name: "hour", ms: (1000 * 60 * 60) }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("time_frames");
    }
};
