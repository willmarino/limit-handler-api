const { Sequelize } = require('sequelize');

(async function() {
    const dbUrl = process.env.DB_URL.slice(0, indexOf("/lh_test"))
    const sequelize = new Sequelize(dbUrl);

    await sequelize.query('CREATE DATABASE IF NOT EXISTS lh_test');
    await sequelize.close();
})();
