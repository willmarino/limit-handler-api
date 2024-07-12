const pug = require("pug");
const qs = require("node:querystring");
const router = require("express").Router();
const projectsService = require("../services/projects");
const timeFramesService = require("../services/time_frames");
const organizationsService = require("../services/organizations");
const responseTemplates = require("../util/response_templates");


/**
 * @description Get user's projects
 */
router.get("/", async (req, res, next) => {
    try{
        const r = await projectsService.getProjects(req);

        const template = pug.compileFile("src/views/projects/index.pug")
        const markup = template({ ...r })

        res.set("HX-Push-Url", "/projects/")
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});

/**
 * @description Get user's projects with a project name search filter
 */
router.post("/search", async (req, res, next) => {
    try{
        const r = await projectsService.searchProjects(req);

        const template = pug.compileFile("src/views/projects/search.pug")
        const markup = template({ ...r })

        res.set("HX-Push-Url", `/projects/search?searchTerm=${(req.body.searchTerm || "")}`)
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});

/**
 * @description Get user's most recently created project
 */
router.get("/recent", async (req, res, next) => {
    try{
        const r = await projectsService.getRecent(req);

        const t = pug.compileFile("src/views/users/lobby.pug");
        const markup = t({ ...r });

        res.set("HX-Push-Url", "/projects/recent");
        res.status(200).send(markup);

    }catch(err){
        next(err);
    }
});



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