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


const reqUtilApp = express();

// 3rd party middleware
reqUtilApp.set('etag', false);
reqUtilApp.use(cors());
reqUtilApp.use(express.json({ limit: Infinity }));
reqUtilApp.use(express.urlencoded({ extended: false }));
reqUtilApp.use(context());
if (process.env.NODE_ENV !== "test") reqUtilApp.use(morganLog);

// Custom middelware - add in request logger and unique tag
reqUtilApp.use(customMiddleware.addRequestContext);
reqUtilApp.use(customMiddleware.validateAuthToken);


// Declare subrouters
reqUtilApp.use("/requests", requestsRouter);
reqUtilApp.use("/tokens", tokensRouter);
reqUtilApp.use("/server_health", serverHealthRouter);


// Custom middelware - catch-all error handler
reqUtilApp.use(customMiddleware.errorHandler);

// Initiate express server
let reqUtilServer;
if (process.env.NODE_ENV !== "test") {

    (async () => {
        await migHelpers.migrationCheckup();
        await RED.setClient();
        await RED.storeOrganizations();
        await RED.storeProjects();
    })();

    logger.info("Pre-boot checks completed, running express reqUtilServer");

    reqUtilServer = reqUtilApp.listen(
        process.env.EXPRESS_PORT,
        async () => {
            logger.info("Express reqUtilServer initiated on port " + process.env.EXPRESS_PORT + "...");
        }
    );
}

module.exports = {
    reqUtilApp,
    reqUtilServer
}