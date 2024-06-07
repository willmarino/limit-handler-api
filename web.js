// TODO learn how to cache assets on browser. Shouldn't need to re-fetch fonts every time I reload
const path = require("node:path");
const cors = require("cors");
const express = require("express");
const favicon = require("serve-favicon");
const context = require("express-context-store");
const cookieSession = require("cookie-session");

const RED = require("./src/util/redis_connection_wrapper");
const serverHealthRouter = require("./src/routers/server_health");
const usersRouter = require("./src/routers/users");
const organizationsRouter = require("./src/routers/organizations");
const subTiersRouter = require("./src/routers/subscription_tiers");
const subscriptionsRouter = require("./src/routers/subscriptions");
const membershipsRouter = require("./src/routers/memberships");
const projectsRouter = require("./src/routers/projects");
const invitationsRouter = require("./src/routers/invitations");

const authRouter = require("./src/routers/auth");

const { logger } = require("./src/util/logger");
const { morganLog } = require("./src/helpers/logging");
const customMiddleware = require("./src/helpers/middleware");
const migHelpers = require("./src/helpers/migrate");
require("./src/helpers/array_extensions");

const webApp = express();

// 3rd party middleware
webApp.use(cors());
webApp.use(context());
webApp.set("etag", false);
webApp.set("view engine", "pug");
webApp.set("views", path.join(__dirname, "src/views"));
webApp.use(favicon(path.join(__dirname, "src/assets/img/logo", "clock_16.png")))
webApp.use(express.static(path.join(__dirname, "src/assets")));
webApp.use(express.json({ limit: Infinity }));
webApp.use(express.urlencoded({ extended: false }));
webApp.use(
    cookieSession({
        name: "limit_handler",
        keys: [ process.env.COOKIE_SESSION_KEY ],
        maxAge: 1000 * 60 * 60 * 24
    })
);

if (process.env.NODE_ENV !== "test") webApp.use(morganLog);

// Custom middelware - add in request logger and unique request id
webApp.use(customMiddleware.addRequestContext);

// Unauthenticated routes
webApp.use("/auth", authRouter);
webApp.use("/server_health", serverHealthRouter);

// Session cookie validation
webApp.use(customMiddleware.validateSessionCookie);

// Authenticated routes
webApp.use("/users", usersRouter)
webApp.use("/projects", projectsRouter);
webApp.use("/organizations", organizationsRouter);
webApp.use("/subscription_tiers", subTiersRouter);
webApp.use("/subscriptions", subscriptionsRouter);
webApp.use("/memberships", membershipsRouter);
webApp.use("/invitations", invitationsRouter);

// Redirect to login page if the requested path can't be matched to a route handler
webApp.use("/", (req, res, next) => {
    res.redirect("/users/show");
})

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