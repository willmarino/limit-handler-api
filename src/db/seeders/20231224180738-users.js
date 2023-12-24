'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        // TODO need to set up a password hashing helper function which I can use in this file to gen password hashes from normal strings
        await queryInterface.bulkInsert(
            "users",
            [
                { id: 1, username: "bob", password: "placeholder" },
                { id: 2, username: "dan", password: "placeholder" },
                { id: 3, username: "greg", password: "placeholder" },
                { id: 4, username: "jack", password: "placeholder" },
                { id: 5, username: "bill", password: "placeholder" }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users");
    }
};
