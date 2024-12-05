const qs = require("node:querystring");
const pug = require("pug");
const router = require("express").Router();
const subTiersService = require("../services/subscription_tiers");


router.get("/", async (req, res, next) => {
    try{
        const template = pug.compileFile("src/views/landing/landing.pug");
        const markup = template();
        res.status(200).send(markup);
    }catch(err){
        next(err);
    }
});

// add routes for 'about', 'pricing', 'contact',


module.exports = router;