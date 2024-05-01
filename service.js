const cors = require("cors");
const express = require("express");
const context = require("express-context-store");

const RED = require("./src/util/redis_connection_wrapper");
const serverHealthRouter = require("./src/routers/server_health");
const requestsRouter = require("./src/routers/requests");
const tokensRouter = require("./src/routers/tokens");

const { logger } = require("./src/util/logger");
const { morganLog } = require("./src/helpers/logging");
const customMiddleware = require("./src/helpers/middleware");
const migHelpers = require("./src/helpers/migrate");
require("./src/helpers/array_extensions");


const serviceApp = express();

// 3rd party middleware
serviceApp.set('etag', false);
serviceApp.use(cors());
serviceApp.use(express.json({ limit: Infinity }));
serviceApp.use(express.urlencoded({ extended: false }));
serviceApp.use(context());
if (process.env.NODE_ENV !== "test") serviceApp.use(morganLog);

// Custom middelware - add in request logger and unique tag
serviceApp.use(customMiddleware.addRequestContext);
serviceApp.use(customMiddleware.validateAuthToken);


// Declare subrouters
serviceApp.use("/requests", requestsRouter);
serviceApp.use("/tokens", tokensRouter);
serviceApp.use("/server_health", serverHealthRouter);


// Custom middelware - catch-all error handler
serviceApp.use(customMiddleware.errorHandler);

// Initiate express server
let server;
if (process.env.NODE_ENV !== "test") {

    (async () => {
        await migHelpers.migrationCheckup();
        await RED.setClient();
        await RED.storeOrganizations();
        await RED.storeProjects();;
    })();

    logger.info("Pre-boot checks completed, running express server");

    server = serviceApp.listen(
        process.env.EXPRESS_PORT,
        async () => {
            logger.info("Express server initiated on port " + process.env.EXPRESS_PORT + "...");
        }
    );
}

module.exports = {
    serviceApp,
    server
}