/*
Configure what db connection the sequelize-cli uses
We use the sequelize-cli for migrations
Docs: https://github.com/sequelize/cli/blob/HEAD/docs/README.md#configuration-connection-environment-variable
*/
module.exports = {
    [process.env.DB_URL]: {
        url: process.env.DB_URL,
        dialect: "mysql"
    }
}