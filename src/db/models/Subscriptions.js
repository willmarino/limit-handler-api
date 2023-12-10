const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Subscriptions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    subscriptionTierId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'subscription_tiers',
        key: 'id'
      },
      field: 'subscription_tier_id'
    },
    organizationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id'
      },
      field: 'organization_id'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_active'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'subscriptions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "subscription_tier_id",
        using: "BTREE",
        fields: [
          { name: "subscription_tier_id" },
        ]
      },
      {
        name: "organization_id",
        using: "BTREE",
        fields: [
          { name: "organization_id" },
        ]
      },
    ]
  });
};
