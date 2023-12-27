'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        // TODO need to set up a password hashing helper function which I can use in this file to gen password hashes from normal strings
        await queryInterface.bulkInsert(
            "users",
            [
                { id: 1, user_name: "bob", password: "placeholder" },
                { id: 2, user_name: "dan", password: "placeholder" },
                { id: 3, user_name: "greg", password: "placeholder" },
                { id: 4, user_name: "jack", password: "placeholder" },
                { id: 5, user_name: "bill", password: "placeholder" }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users");
    }
};
