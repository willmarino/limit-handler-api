var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _Memberships = require("./Memberships");
var _Organizations = require("./Organizations");
var _SubscriptionTiers = require("./SubscriptionTiers");
var _Subscriptions = require("./Subscriptions");
var _UserRoles = require("./UserRoles");
var _Users = require("./Users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var Memberships = _Memberships(sequelize, DataTypes);
  var Organizations = _Organizations(sequelize, DataTypes);
  var SubscriptionTiers = _SubscriptionTiers(sequelize, DataTypes);
  var Subscriptions = _Subscriptions(sequelize, DataTypes);
  var UserRoles = _UserRoles(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Memberships.belongsTo(Organizations, { as: "organization", foreignKey: "organizationId"});
  Organizations.hasMany(Memberships, { as: "memberships", foreignKey: "organizationId"});
  Subscriptions.belongsTo(Organizations, { as: "organization", foreignKey: "organizationId"});
  Organizations.hasMany(Subscriptions, { as: "subscriptions", foreignKey: "organizationId"});
  Subscriptions.belongsTo(SubscriptionTiers, { as: "subscriptionTier", foreignKey: "subscriptionTierId"});
  SubscriptionTiers.hasMany(Subscriptions, { as: "subscriptions", foreignKey: "subscriptionTierId"});
  Memberships.belongsTo(UserRoles, { as: "userRole", foreignKey: "userRoleId"});
  UserRoles.hasMany(Memberships, { as: "memberships", foreignKey: "userRoleId"});
  Memberships.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Memberships, { as: "memberships", foreignKey: "userId"});

  return {
    SequelizeMeta,
    Memberships,
    Organizations,
    SubscriptionTiers,
    Subscriptions,
    UserRoles,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
