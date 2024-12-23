const {Router} = require("express");
const router = Router();
const genreController = require("../controllers/genreController");

router.get("/all", genreController.getAllRecords);
router.get("/settings", genreController.getSettingsPage);
router.post("/settings", genreController.createNewGenre);
router.post("/settings/delete", genreController.deleteGenre);
router.get("/:genreId", genreController.getRecordsInGenre);

module.exports = router;