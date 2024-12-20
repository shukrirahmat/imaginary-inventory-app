const {Router} = require("express");
const router = Router();
const genreController = require("../controllers/genreController");

router.get("/all", genreController.getAllRecords);
router.get("/:genreId", genreController.getRecordsInGenre);

module.exports = router;