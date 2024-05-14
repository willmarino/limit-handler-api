const router = require("express").Router();
const projectsService = require("../services/projects");
const responseTemplates = require("../util/response_templates");


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