const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const { sequelize } = require("../db/connection");
const { logger } = require("../util/logger");


const migrationCheckup = async () => {
    logger.info("checking migrations");

    const umzugInst = new Umzug({
        migrations: {
            glob: "src/db/migrations/*.js",
            resolve: ({ name, path, context }) => {
                const migration = require(path);
    
                return {
                    name,
                    up: async () => migration.up(context, Sequelize),
                    down: async () => migration.down(context, Sequelize)
                }
            }
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console
    });

    const executed = await umzugInst.executed();
    if(process.env.NODE_ENV !== "development"){
        logger.info("Executed migrations", { executed });
    }

    const pending = await umzugInst.pending();
    if(process.env.NODE_ENV !== "development"){
        logger.info("Pending migrations", { pending });
    }

    const running = await umzugInst.up();
    if(process.env.NODE_ENV !== "development"){
        logger.info("Running migrations", { running });
    }

};


module.exports = {
    migrationCheckup
}