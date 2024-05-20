'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn(
            "subscription_tiers",
            "readable_call_limit",
            {
                type: Sequelize.DataTypes.STRING(64),
                allowNull: false,
                field: "readable_call_limit"
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn( "subscription_tiers", "readable_call_limit" );
    }
};
