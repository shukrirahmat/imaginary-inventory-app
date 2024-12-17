const {Router} = require("express");
const router = Router();
const genreController = require("../controllers/genreControllers")

router.get("/", genreController.getAllRecords);

router.get("/:name", (req, res) => {
    const {name} = req.params;
    res.send(`THIS WILL SHOW ALL RECORD WITH ${name} GENRE`)
})

module.exports = router;