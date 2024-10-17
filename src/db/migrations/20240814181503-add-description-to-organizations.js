'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn(
            "organizations",
            "description",
            {
                type: Sequelize.DataTypes.STRING(255),
                field: "description",
                allowNull: false
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn("organizations", "description");
    }
};
