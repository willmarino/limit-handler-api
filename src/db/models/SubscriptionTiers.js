const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SubscriptionTiers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(24),
      allowNull: false
    },
    cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    userLimitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_limit_count'
    },
    callLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'call_limit'
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
    },
    readableCallLimit: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: 'readable_call_limit'
    }
  }, {
    sequelize,
    tableName: 'subscription_tiers',
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
    ]
  });
};
