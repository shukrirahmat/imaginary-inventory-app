const db = require("../db/queries");

const getNewRecordPage = async (req, res) => {
    res.render("newRecord",{title: "Add new record"})
}

module.exports = {
    getNewRecordPage
}