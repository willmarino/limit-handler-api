'use strict';
const { createHash } = require("../../helpers/bcrypt");
const { getRandomLoremIpsum } = require("../../helpers/lorem_ipsum")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {

        const orgData = [
            { id: 1, name: "test org 1", identifier: "testidentifier1", refresh_token: "testrefreshtoken1", description: getRandomLoremIpsum(80) },
            { id: 2, name: "test org 2", identifier: "testidentifier2", refresh_token: "testrefreshtoken2", description: getRandomLoremIpsum(80) },
            { id: 3, name: "test org 3", identifier: "testidentifier3", refresh_token: "testrefreshtoken3", description: getRandomLoremIpsum(80) }
        ];

        for(const d of orgData){
            d.refresh_token = await createHash(d.refresh_token);
        }

        await queryInterface.bulkInsert("organizations", orgData);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("organizations");
    }
};
