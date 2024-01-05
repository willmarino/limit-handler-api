const REDIS_WRAPPER = require("../util/redis_connection_wrapper");

/**
 * @description Given the timestamp at which the request was initiated,
 * figure out how long the user should wait to hit their 3rd party
 * given their previous requests stored in redis.
 * 
 * First we load the project's config and "requests" (list of prior request timestamps).
 * Then we remove all prior request timestamps which are outside the relevant timeframe from the requests array.
 * If, after this, we have fewer requests than are allowed per time limit, we can just return a waitTime of 0.
 * 
 * If not, then we find out how long we will have to wait in order to be able to add
 *      another request timestamp while being inside the callLimit, and return that.
 * 
 * @param requestTS - Timestamp denoting when the request was initiated from the client.
 */
const processRequest = async (projectId, requestTS) => {
    const projectInfoString = await REDIS_WRAPPER.client.get(`projects:${projectId}`);
    const projectInfo = JSON.parse(projectInfoString);
    const { callLimit, timeFrameMS, requests: prevRequests } = projectInfo;

    const timeFrameStartMS = requestTS - timeFrameMS;

    let pointer;
    for(let i = 0; i < prevRequests.length; i++){
        const prevRequestTS = prevRequests[i];
        if(prevRequestTS >= timeFrameStartMS){
            pointer = i;
            break;
        }
    }
    const requestsWithinTimeFrame = [ ...prevRequests.slice(pointer, prevRequests.length), requestTS ];

    let waitTime;
    if(requestsWithinTimeFrame.length <= callLimit){
        waitTime = 0;
    }else{
        const lastBlockingRequestTS = requestsWithinTimeFrame[(requestsWithinTimeFrame.length - 1) - callLimit];
        waitTime = lastBlockingRequestTS - timeFrameStartMS;
    }

    await REDIS_WRAPPER.client.set(
        `projects:${projectId}`,
        JSON.stringify({
            callLimit,
            timeFrameMS,
            requests: requestsWithinTimeFrame
        })
    );


    return { waitTime };

}



module.exports = {
    processRequest
};