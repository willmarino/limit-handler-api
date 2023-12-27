'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable(
            "users",
            {
                id: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    field: "id"
                },
                userName: {
                    type: Sequelize.DataTypes.STRING(24),
                    allowNull: false,
                    field: "user_name"
                },
                email: {
                    type: Sequelize.DataTypes.STRING(36),
                    allowNull: false,
                    field: "email"
                },
                password: {
                    type: Sequelize.DataTypes.STRING(64),
                    allowNull: false,
                    field: "password"
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
        await queryInterface.dropTable("users");
    }
};