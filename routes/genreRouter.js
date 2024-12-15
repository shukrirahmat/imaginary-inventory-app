const {Router} = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.send("THIS PAGE SHOW ALL RECORDS");
})

router.get("/:name", (req, res) => {
    const {name} = req.params;
    res.send(`THIS WILL SHOW ALL RECORD WITH ${name} GENRE`)
})

module.exports = router;