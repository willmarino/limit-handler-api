'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable(
            "organizations",
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
                subscriptionId: {
                    allowNull: false,
                    references: {
                        model: "subscriptions",
                        key: "id"
                    },
                    field: "subscription_id"
                }
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("organizations");
    }
};

// 20231204000535