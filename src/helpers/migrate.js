const { Umzug, SequelizeStorage } = require("umzug");
const { sequelize, models } = require("../db/connection");
const { logger } = require("../util/logger");


const migrationCheckup = async () => {
    logger.info("checking migrations");

    const umzugInst = new Umzug({
        migrations: { glob: "src/db/migrations/*.js" },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console
    });

    const executed = await umzugInst.executed();
    logger.info("Executed migrations", { executed });

    const pending = await umzugInst.pending();
    logger.info("Pending migrations", { pending });

    const running = await umzugInst.up();
    logger.info("Running migrations", { running });

};


module.exports = {
    migrationCheckup
}