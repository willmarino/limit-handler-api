const redis = require("redis");
const { models } = require("../db/connection");
const { logger } = require("./logger");

class RedisWrapper {
    constructor() {
        this.client = null;
    }


    /**
     * @description Set up an initial redis connection (run on express boot)
     */
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

    /**
     * @description Pull and cache project information for fast lookup during request processing.
     */
    async setupProjects(){
        const projects = await models.Projects.findAll({
            where: { active: true },
            include: [
                { model: models.TimeFrames, as: "timeFrame" }
            ]
        });
        for(const project of projects){
            await this.client.set(
                `projects:${project.id}`,
                JSON.stringify({
                    name: project.name,
                    callLimit: project.callLimit,
                    timeFrameMS: project.timeFrame.ms,
                    requests: []
                })
            );
        }
    }

    /**
     * @description Log the projects stored in redis
     * Using console.log instead of logger.info because this is really just for testing
     */
    async logProjects(){
        const keys = await this.client.keys("projects:*");
        for(const key of keys){
            console.log(key);
            const val = await this.client.get(key);
            console.log(val);
        }
    }

    async clear(){
        const keys = await this.client.keys("*");
        await Promise.all(
            keys.map(async k => await this.client.del(k))
        );
    }

    /**
     * @description Close existing redis connection.
     */
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