const redis = require("redis");
const { logger } = require("./logger");

class RedisWrapper {
    constructor() {
        this.client = null;
    }

    async setClient() {
        if (!this.client) {
            const client = redis.createClient({
                url: `redis://${process.env.REDIS_URL}`
            });

            client.on("error", (err) => logger.err("Redis Client Error", err));
            client.on("connection", () => {
                logger.info("Connection to Redis successful");
            })

            await client.connect();
            this.client = client;
        } else {
            return this.client;
        }
    }

    async closeClient() {
        if (this.client) {
            await this.client.disconnect();
            logger.info("Client closed");
        } else {
            logger.info("No client closed because none exists");
        }
    }

}

const REDIS_WRAPPER = new RedisWrapper();
module.exports = REDIS_WRAPPER;