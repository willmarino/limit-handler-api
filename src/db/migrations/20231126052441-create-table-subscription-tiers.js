'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable(
            "subscription_tiers",
            {
                id: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    field: "id"
                },
                name: {
                    type: Sequelize.DataTypes.STRING(24),
                    allowNull: false,
                    field: "name"
                },
                cost: {
                    type: Sequelize.DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    field: "cost"
                },
                userLimitCount: {
                    type: Sequelize.DataTypes.INTEGER,
                    allowNull: false,
                    field: "user_limit_count"
                }
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("subscription_tiers");
    }
};
