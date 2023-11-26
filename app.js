const cors = require("cors");
const express = require("express");
const context = require("express-context-store");

const REDIS_WRAPPER = require("./src/util/redis_connection_wrapper");
const serverHealthRouter = require("./src/routers/server_health");

const { logger } = require("./src/util/logger");
const { morganLog } = require("./src/helpers/logging");
const { addRequestContext } = require("./src/helpers/requests");

// Declare express app and function middleware
const app = express();
app.set('etag', false);
app.use(cors());
app.use(express.json({ limit: Infinity }));
app.use(express.urlencoded({ extended: false }));
app.use(context());
app.use(addRequestContext)
if (process.env.NODE_ENV !== "test") app.use(morganLog);

// Declare subrouters
app.use("/server_health", serverHealthRouter);

let server;
if (process.env.NODE_ENV !== "test") {
    server = app.listen(
        process.env.EXPRESS_PORT,
        async () => {
            await REDIS_WRAPPER.setClient();
            logger.info("Express server initiated on port " + process.env.EXPRESS_PORT + "...");
        }
    );
}


module.exports = {
    server
}