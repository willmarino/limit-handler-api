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
                apiKey: {
                    type: Sequelize.DataTypes.STRING(36),
                    allowNull: false,
                    field: "api_key"
                },
                createdAt: {
                    type: Sequelize.DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    field: 'created_at',
                },
                updatedAt: {
                    type: Sequelize.DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    field: 'updated_at',
                }
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("organizations");
    }
};