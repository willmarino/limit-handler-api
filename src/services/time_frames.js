const { models } = require("../db/connection");


/**
 * @description Fetch all timeframe records.
 */
const getTimeFrames = async () => {
    const timeFrames = await models.TimeFrames.findAll();
    return timeFrames;
};



module.exports = {
    getTimeFrames
}