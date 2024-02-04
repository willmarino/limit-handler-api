const { Sequelize } = require('sequelize');

(async function() {
  const sequelize = new Sequelize(process.env.DB_URL);

  await sequelize.query('CREATE DATABASE IF NOT EXISTS lh_test');
  await sequelize.close();
})();
