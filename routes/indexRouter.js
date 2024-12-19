const {Router} = require("express");
const router = Router();
const indexController = require("../controllers/indexController")

router.get("/", indexController.getIndexPage);
router.get("/all", indexController.getAllRecords);
router.get("/:genreId", indexController.getRecordsInGenre)

module.exports = router;