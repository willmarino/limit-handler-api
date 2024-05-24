const pug = require("pug");
const qs = require("node:querystring");
const router = require("express").Router();
const projectsService = require("../services/projects");
const timeFramesService = require("../services/time_frames");
const organizationsService = require("../services/organizations");
const responseTemplates = require("../util/response_templates");

router.get("/new", async(req, res, next) => {
    try{
        const { orgId } = req.query;

        const org = await organizationsService.getOrgSimple(orgId);
        const timeframes = await timeFramesService.getTimeFrames();

        const template = pug.compileFile("src/views/projects/new.pug");
        const markup = template({ org, timeframes });

        res.set("HX-Push-Url", `/projects/new/?orgId=${orgId}`)
        res.status(200).send(markup);

    }catch(err){
        next(err);
    }
})


/**
 * @description Projects create route.
 */
router.post("/create", async (req, res, next) => {
    try{
        const project = await projectsService.create(req);

        res.status(200).send(
            responseTemplates.success(project, "Success creating new project")
        )
    }catch(err){
        next(err);
    }
});


module.exports = router;