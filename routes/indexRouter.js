const {Router} = require("express");
const router = Router();
const indexController = require("../controllers/indexController")

router.get("/", indexController.getIndexPage);
router.post("/addgenre", indexController.addNewGenre)

module.exports = router;