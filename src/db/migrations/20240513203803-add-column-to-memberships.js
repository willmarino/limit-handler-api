'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn(
            "memberships",
            "primary",
            {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
                field: "primary"
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn( "memberships", "primary" );
    }
};
