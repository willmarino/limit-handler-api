const pug = require("pug");
const qs = require("node:querystring");
const router = require("express").Router();
const projectsService = require("../services/projects");
const timeFramesService = require("../services/time_frames");
const organizationsService = require("../services/organizations");
const usersService = require("../services/users");
const responseTemplates = require("../util/response_templates");


/**
 * @description Get user's projects.
 * Request query can include a searchTerm param, but does not have to. 
 */
router.get("/", async (req, res, next) => {
    try{
        const r = await projectsService.getProjects(req);

        const template = pug.compileFile("src/views/projects/index.pug")
        const markup = template({ ...r })

        let urlString = `/projects?curPage=${r.curPage}`;
        if(r.searchTerm) urlString += `&searchTerm=${r.searchTerm}`;

        res.set("HX-Push-Url", urlString);
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});

/**
 * @description Get a single project.
 * Request query can include a searchTerm param, but does not have to. 
 */
router.get("/show/:id", async (req, res, next) => {
    try{
        const r = await projectsService.getProject(req);

        const template = pug.compileFile("src/views/projects/show.pug")
        const markup = template({ ...r })

        res.set("HX-Push-Url", `/projects/show/${req.params.id}`);
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});


/**
 * @description Get user's most recently created project
 */
// router.get("/recent", async (req, res, next) => {
//     try{
//         const r = await projectsService.getRecent(req);

//         const t = pug.compileFile("src/views/users/lobby.pug");
//         const markup = t({ ...r });

//         res.set("HX-Push-Url", "/projects/recent");
//         res.status(200).send(markup);

//     }catch(err){
//         next(err);
//     }
// });



router.get("/new", async(req, res, next) => {
    try{
        const r = await usersService.getUser(req.session.user.userId);
        const timeframes = await timeFramesService.getTimeFrames();

        const template = pug.compileFile("src/views/projects/new.pug");
        const markup = template({ ...r, timeframes });

        res.set("HX-Push-Url", `/projects/new`)
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
        await projectsService.create(req);
        
        res.redirect("/projects")

    }catch(err){
        next(err);
    }
});


module.exports = router;