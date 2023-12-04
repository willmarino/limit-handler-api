'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable(
            "subscriptions",
            {
                id: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    field: "id"
                },
                subscriptionTierId: {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'subscription_tiers',
                        key: 'id',
                    },
                    field: 'subscription_tier_id',
                },
                isActive: {
                    type: Sequelize.DataTypes.BOOLEAN,
                    allowNull: false,
                    field: "is_active"
                }
                
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("subscriptions");
    }
};
