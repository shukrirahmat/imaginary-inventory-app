const {Router} = require("express");
const router = Router();
const recordController = require("../controllers/recordController")

router.get("/new", recordController.getNewRecordPage);
router.post("/new", recordController.createNewRecord);
router.post("/delete", recordController.deleteRecord);
router.post("/edit", recordController.editRecord);
router.post("/editForm", recordController.getEditPage);
router.get("/all", recordController.getAllRecords);
router.get("/view", recordController.viewRecord);
router.get("/createSuccess", recordController.showCreateSuccessPage);
router.get("/:genreId", recordController.getRecordsInGenre);

module.exports = router;