'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable(
            "projects",
            {
                id: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    field: "id"
                },
                identifier: {
                    type: Sequelize.DataTypes.STRING(16),
                    allowNull: false,
                    field: "identifier"
                },
                organizationId: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'organizations',
                        key: 'id',
                    },
                    field: 'organization_id',
                },
                creatorId: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                    field: 'creator_id',
                },
                timeFrameId: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'time_frames',
                        key: 'id',
                    },
                    field: 'time_frame_id',
                },
                name: {
                    type: Sequelize.DataTypes.STRING(36),
                    allowNull: false,
                    field: "name"
                },
                callLimit: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    field: "call_limit"
                },
                active: {
                    type: Sequelize.DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                    field: "active"
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
            "projects",
            ["identifier"],
            {
                name: "projects_identifier_idx",
                unique: "true",
                using: "BTREE",
                fields: ["identifier"],
            }
        )

        await queryInterface.addIndex(
            "projects",
            ["name"],
            {
                name: "projects_name_idx",
                unique: "true",
                using: "BTREE",
                fields: ["name"],
            }
        )

    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("projects");
    }
};