const pug = require("pug");
const qs = require("node:querystring");
const router = require("express").Router();
const projectsService = require("../services/projects");
const organizationsService = require("../services/organizations");
const responseTemplates = require("../util/response_templates");

router.get("/new", async(req, res, next) => {
    try{
        const { orgId } = req.query;
        const org = await organizationsService.getOrgSimple(orgId);
        const template = pug.compileFile("src/views/projects/new");
        const markup = template({ org });

        res.status(200).send(markup);

    }catch(err){
        next(err);
    }
})


/**
 * @description Projects create route.
 */
router.post("/", async (req, res, next) => {
    try{
        const { projectConfig } = req.body;

        const project = await projectsService.create(req.session.user.userId, projectConfig);

        res.status(200).send(
            responseTemplates.success(project, "Success creating new project")
        )
    }catch(err){
        next(err);
    }
});


module.exports = router;