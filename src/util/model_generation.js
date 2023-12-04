const fs = require("fs");
const { Sequelize } = require("sequelize");
const sequelizeAuto = require("sequelize-auto");
const logger = require("./logger");

// Connect to database, run auto-generation of models
const run = async () => {

    if (!fs.existsSync(`src/models`)) {
        fs.mkdirSync(`src/models`);
    }

    const previouslyGeneratedModelFiles = fs.readdirSync(
        `./src/models`
    );

    for (const fileName of previouslyGeneratedModelFiles) {
        logger.info(`Removing models/${fileName}`);
        fs.unlinkSync(`./src/models/${fileName}`);
    }

    const sequelize = new Sequelize(
        process.env.DB_URL,
        {
            pool: {
                max: 5,
                min: 0,
                idle: 10000,
            }
        }
    );

    try {
        await sequelize.authenticate();
        logger.info("Connection has been established successfully.");
    } catch (err) {
        console.error(`Unable to connect to the database`);
    }

    const options = {
        caseFile: "p",
        caseModel: "p",
        caseProp: "c",
        underscored: false,
        additional: {
            timestamps: false,
        },
        directory: `src/models`,
    };
    const auto = new sequelizeAuto(sequelize, null, null, options);
    await auto.run();
    logger.info("ENDING MODEL GENERATION --------------------------");
};

run();
