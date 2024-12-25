const {Router} = require("express");
const router = Router();
const genreController = require("../controllers/genreController");

router.get("/", genreController.getSettingsPage);
router.post("/new", genreController.createNewGenre);
router.post("/delete", genreController.deleteGenre);
router.post("/rename", genreController.renameGenre);

module.exports = router;