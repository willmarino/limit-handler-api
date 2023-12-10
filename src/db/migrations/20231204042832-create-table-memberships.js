'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        try{
            await queryInterface.createTable(
                "memberships",
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
                            model: 'organizations',
                            key: 'id',
                        },
                        field: 'organization_id',
                    },
                    usersId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        references: {
                            model: "users",
                            key: "id"
                        },
                        field: "user_id"
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
        }catch(err){
            console.log(err);
        }
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("memberships");
    }
};