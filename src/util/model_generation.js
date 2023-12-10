const fs = require("fs");
const { Sequelize } = require("sequelize");
const sequelizeAuto = require("sequelize-auto");
const { logger } = require("./logger");

// Connect to database, run auto-generation of models
const run = async () => {

    logger.info("Ensuring directory structure...");
    if (!fs.existsSync("src/db/models")) {
        fs.mkdirSync("src/db/models");
    }

    logger.info("Removing old model files...");
    const previouslyGeneratedModelFiles = fs.readdirSync(
        "./src/db/models"
    );

    for (const fileName of previouslyGeneratedModelFiles) {
        logger.info(`Removing models/${fileName}`);
        fs.unlinkSync(`./src/db/models/${fileName}`);
    }

    logger.info("Initializing db connection...");
    const sequelize = new Sequelize(
        process.env.DB_URL,
        {
            pool: {
                max: 5,
                min: 0,
                idle: 10000,
            },
            logging: false
        }
    );

    try {
        await sequelize.authenticate();
        logger.info("Connection has been established successfully.");
    } catch (err) {
        logger.error(`Unable to connect to the database`);
    }

    logger.info("Generating new models...");
    const options = {
        caseFile: "p",
        caseModel: "p",
        caseProp: "c",
        underscored: false,
        additional: {
            timestamps: false,
        },
        directory: `src/db/models`,
    };
    const auto = new sequelizeAuto(sequelize, null, null, options);
    await auto.run();
    
    logger.info("Model generation complete");
};

run();
