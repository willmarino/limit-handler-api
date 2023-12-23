'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("organizations", [
            { name: "test org 1", api_key: "testapikey1" },
            { name: "test org 2", api_key: "testapikey2" }
        ]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("organizations");
    }
};