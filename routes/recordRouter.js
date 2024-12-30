const {Router} = require("express");
const router = Router();
const recordController = require("../controllers/recordController")

router.get("/new", recordController.getNewRecordPage);
router.post("/new", recordController.createNewRecord);
router.post("/edit", recordController.editRecord);
router.get("/all", recordController.getAllRecords);
router.get("/view", recordController.viewRecord);
router.get("/createSuccess", recordController.showCreateSuccessPage);
router.get("/editSuccess", recordController.showEditSuccessPage);
router.post("/editForm/:id", recordController.getEditPage);
router.post("/delete/:id", recordController.deleteRecord);
router.get("/:genreId", recordController.getRecordsInGenre);

module.exports = router;