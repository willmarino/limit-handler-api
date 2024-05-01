/*
Configure what db connection the sequelize-cli uses
We use the sequelize-cli for migrations
Docs: https://github.com/sequelize/cli/blob/HEAD/docs/README.md#configuration-connection-environment-variable
*/
const config = {
    [process.env.NODE_ENV]: {
        url: process.env.DB_URL,
        dialect: "mysql",
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
        dialectOptions: { decimalNumbers: true },
    }
}


module.exports = config;