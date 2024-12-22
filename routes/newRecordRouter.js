const {Router} = require("express");
const router = Router();
const newRecordController = require("../controllers/newRecordController")

router.get("/", newRecordController.getNewRecordPage);
router.post("/", newRecordController.createNewRecord);

module.exports = router;