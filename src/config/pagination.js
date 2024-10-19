

const itemsPerPage = 8;


/**
 * @description Take in a request object and a 
 */
const setPaginationData = (req, curPage, count) => {
    const numPages = Math.ceil(count / itemsPerPage);

    req.context.set("pagination", { numPages, curPage });
}


module.exports = {
    itemsPerPage,
    setPaginationData
}


