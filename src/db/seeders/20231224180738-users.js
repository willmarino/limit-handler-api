'use strict';
const { createPasskeyHash } = require("../../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {

        const userData = [
            { id: 1, user_name: "usernamebob", email: "testemail1@mail.com", password: "password1!" },
            { id: 2, user_name: "usernamedan", email: "testemail2@mail.com", password: "password2@" },
            { id: 3, user_name: "usernamegreg", email: "testemail3@mail.com", password: "password3#" },
            { id: 4, user_name: "usernamejack", email: "testemail4@mail.com", password: "password4$" },
            { id: 5, user_name: "usernamebill", email: "testemail5@mail.com", password: "password5%" }
        ]

        for(const user of userData){
            user.password = await createPasskeyHash(user.password);
        }
        
        await queryInterface.bulkInsert(
            "users",
            userData
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users");
    }
};
