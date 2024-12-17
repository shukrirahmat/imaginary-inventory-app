const pool = require("./pool");

async function getAllRecords() {
    const {rows} = await pool.query("SELECT * FROM records");
    return rows;
}

module.exports = {
    getAllRecords
}