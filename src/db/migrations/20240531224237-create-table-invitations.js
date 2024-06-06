'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
        async up (queryInterface, Sequelize) {
            await queryInterface.createTable(
                "invitations",
                {
                    id: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        primaryKey: true,
                        autoIncrement: true,
                        allowNull: false,
                        field: "id"
                    },
                    organizationId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        references: {
                            model: "organizations",
                            key: "id"
                        },
                        field: "organization_id"
                    },
                    senderId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        refernces: {
                            model: "users",
                            key: "id"
                        },
                        field: "sender_id"
                    },
                    receiverId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        refernces: {
                            model: "users",
                            key: "id"
                        },
                        field: "receiver_id"
                    },
                    userRoleId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        references: {
                            model: "user_roles",
                            key: "id"
                        },
                        field: "user_role_id"
                    },
                    accepted: {
                        type: Sequelize.DataTypes.BOOLEAN,
                        allowNull: false,
                        defaultValue: false,
                        field: "accepted"
                    },
                    expirationDate: {
                        type: Sequelize.DataTypes.DATE,
                        allowNull: false,
                        field: "expirationDate"
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
            await queryInterface.dropTable("invitations");
        }
};
