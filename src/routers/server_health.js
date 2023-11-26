const express = require("express");
const router = express.Router();


router.get("/check", async (req, res, next) => {
    res.send({ msg: "server healthy" })
})


module.exports = router;