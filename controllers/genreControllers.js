const db = require("../db/queries");

const getAllRecords = async (req, res) => {
    const records = await db.getAllRecords();
    res.render("allrecords", {title: "All Records", records: records})
}

module.exports = {
    getAllRecords
}