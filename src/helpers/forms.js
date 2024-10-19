

/**
 * @description Pull info out of req.query, add in defaults
 */
const getParamsFromQuery = (req, defaults) => {

    const queryParams = {};
    
    for(const key in req.query){
        queryParams[key] = req.query[key];
    }

    for(const key in defaults){
        if(!queryParams[key]){
            queryParams[key] = defaults[key];
        }
    }

    return queryParams;
}


module.exports = {
    getParamsFromQuery,
}