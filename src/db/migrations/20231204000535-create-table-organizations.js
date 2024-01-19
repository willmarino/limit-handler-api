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
                identifier: {
                    type: Sequelize.DataTypes.STRING(16),
                    allowNull: false,
                    field: "identifier"
                },
                refreshToken: {
                    type: Sequelize.DataTypes.STRING(60),
                    allowNull: false,
                    field: "refresh_token"
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

        await queryInterface.addIndex(
            "organizations",
            ["identifier"],
            {
                name: "organizations_identifier_idx",
                unique: "true",
                using: "BTREE",
                fields: ["identifier"],
            }
        )

        await queryInterface.addIndex(
            "organizations",
            ["name"],
            {
                name: "organizations_name_idx",
                unique: "true",
                using: "BTREE",
                fields: ["name"],
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("organizations");
    }
};