'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        // TODO need to set up a password hashing helper function which I can use in this file to gen password hashes from normal strings
        await queryInterface.bulkInsert(
            "users",
            [
                { id: 1, user_name: "usernamebob", email: "testemail1@mail.com", password: "placeholder" },
                { id: 2, user_name: "usernamedan", email: "testemail2@mail.com", password: "placeholder" },
                { id: 3, user_name: "usernamegreg", email: "testemail3@mail.com", password: "placeholder" },
                { id: 4, user_name: "usernamejack", email: "testemail4@mail.com", password: "placeholder" },
                { id: 5, user_name: "usernamebill", email: "testemail5@mail.com", password: "placeholder" }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users");
    }
};
