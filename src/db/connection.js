const { Sequelize } = require("sequelize");

let namespace;

if (process.env.NODE_ENV === "test") {
    const cls = require("cls-hooked");
    namespace = cls.createNamespace("lh-tests");
    Sequelize.useCLS(namespace);
}

const sequelize = new Sequelize(
    process.env.DB_URL,
    {
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
        dialectOptions: { decimalNumbers: true }
    }
);

const models = require("./models/init-models").initModels(sequelize);




module.exports = {
    sequelize,
    models,
    namespace,
};
