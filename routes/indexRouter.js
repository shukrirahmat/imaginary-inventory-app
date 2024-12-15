const {Router} = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.send("THIS PAGE WILL BE HOME WHERE A GENRE CAN BE SELECTED");
})

module.exports = router;