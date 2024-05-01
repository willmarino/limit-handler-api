const cors = require("cors");
const express = require("express");
const context = require("express-context-store");

const RED = require("./src/util/redis_connection_wrapper");
const serverHealthRouter = require("./src/routers/server_health");
const organizationsRouter = require("./src/routers/organizations");
const subTiersRouter = require("./src/routers/subscription_tiers");
const subscriptionsRouter = require("./src/routers/subscriptions");
const usersRouter = require("./src/routers/users");
const membershipsRouter = require("./src/routers/memberships");
const sessionsRouter = require("./src/routers/sessions");
const projectsRouter = require("./src/routers/projects");

const { logger } = require("./src/util/logger");
const { morganLog } = require("./src/helpers/logging");
const customMiddleware = require("./src/helpers/middleware");
const migHelpers = require("./src/helpers/migrate");
require("./src/helpers/array_extensions");

const webApp = express();

// 3rd party middleware
webApp.set('etag', false);
webApp.use(cors());
webApp.use(express.json({ limit: Infinity }));
webApp.use(express.urlencoded({ extended: false }));
webApp.use(context());
if (process.env.NODE_ENV !== "test") webApp.use(morganLog);

// Custom middelware - add in request logger and unique tag
webApp.use(customMiddleware.addRequestContext);
webApp.use(customMiddleware.validateJWT);

// Declare subrouters
webApp.use("/projects", projectsRouter);
webApp.use("/organizations", organizationsRouter);
webApp.use("/subscription_tiers", subTiersRouter);
webApp.use("/subscriptions", subscriptionsRouter);
webApp.use("/users", usersRouter);
webApp.use("/memberships", membershipsRouter);
webApp.use("/sessions", sessionsRouter);
webApp.use("/server_health", serverHealthRouter);


// Custom middelware - catch-all error handler
webApp.use(customMiddleware.errorHandler);

// Initiate express server
let webServer;
if (process.env.NODE_ENV !== "test") {

    (async () => {
        await migHelpers.migrationCheckup();
        await RED.setClient();
        await RED.storeOrganizations();
        await RED.storeProjects();
    })();

    logger.info("Pre-boot checks completed, running express webServer");

    webServer = webApp.listen(
        process.env.EXPRESS_WEB_PORT,
        async () => {
            logger.info("Express webServer initiated on port " + process.env.EXPRESS_WEB_PORT + "...");
        }
    );
}

module.exports = {
    webApp,
    webServer
}